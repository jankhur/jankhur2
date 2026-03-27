import { useState, useCallback, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminApi, uploadImage, getAspectRatio } from "@/lib/adminApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Auth Gate ───────────────────────────────────────────────

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_password", pw);
    try {
      const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${PROJECT_ID}.supabase.co/functions/v1/admin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": pw,
          },
          body: JSON.stringify({ action: "ping" }),
        }
      );
      if (res.status === 401) {
        setError("Wrong password");
        sessionStorage.removeItem("admin_password");
      } else {
        onAuth();
      }
    } catch {
      setError("Connection error");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <form onSubmit={submit} className="flex flex-col gap-4 w-72">
        <h1 className="font-serif text-xl">Admin</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
        />
        {error && <p className="text-red-600 font-serif text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-black text-white font-serif text-sm py-2 hover:bg-neutral-800 active:scale-[0.98] transition-all"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 bg-black text-white font-serif text-sm px-4 py-2 z-50 animate-in fade-in slide-in-from-bottom-2">
      {message}
    </div>
  );
}

function useToastMessage() {
  const [msg, setMsg] = useState("");
  const show = useCallback((m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 2000);
  }, []);
  return { msg, show };
}

// ─── Confirm Dialog ──────────────────────────────────────────

function ConfirmDialog({
  open,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white p-6 max-w-sm w-full shadow-lg">
        <p className="font-serif text-sm mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="font-serif text-sm px-3 py-1 border border-neutral-300 hover:border-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="font-serif text-sm px-3 py-1 bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function useConfirm() {
  const [state, setState] = useState<{ message: string; resolve: (v: boolean) => void } | null>(null);

  const confirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ message, resolve });
    });
  }, []);

  const dialog = state ? (
    <ConfirmDialog
      open
      message={state.message}
      onConfirm={() => { state.resolve(true); setState(null); }}
      onCancel={() => { state.resolve(false); setState(null); }}
    />
  ) : null;

  return { confirm, dialog };
}

// ─── Global Copyright Hook ───────────────────────────────────

function useGlobalCopyright() {
  const { data: globalCopyright = "" } = useQuery({
    queryKey: ["site-settings-copyright"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings" as any)
        .select("value")
        .eq("key", "copyright")
        .single();
      return (data as any)?.value || "© Jan Khür";
    },
  });
  return globalCopyright;
}

// ─── Image Upload Component ─────────────────────────────────

function ImageUploader({
  onUpload,
  multiple = true,
}: {
  onUpload: (files: { url: string; aspectRatio: number; file: File }[]) => void;
  multiple?: boolean;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFiles = async (fileList: FileList) => {
    setUploading(true);
    const results: { url: string; aspectRatio: number; file: File }[] = [];
    const total = fileList.length;

    for (let i = 0; i < total; i++) {
      const file = fileList[i];
      const [url, aspectRatio] = await Promise.all([
        uploadImage(file),
        getAspectRatio(file),
      ]);
      results.push({ url, aspectRatio, file });
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    onUpload(results);
    setUploading(false);
    setProgress(0);
  };

  return (
    <div className="border border-dashed border-neutral-300 p-4 text-center">
      {uploading ? (
        <div className="font-serif text-sm">
          Uploading... {progress}%
          <div className="w-full bg-neutral-100 h-1 mt-2">
            <div className="bg-black h-1 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <label className="cursor-pointer font-serif text-sm text-neutral-500 hover:text-black transition-colors">
          Drop images here or click to upload
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </label>
      )}
    </div>
  );
}

// ─── Inline Editable Field ───────────────────────────────────

function InlineField({
  value,
  onSave,
  placeholder,
  className: extraClass,
}: {
  value: string;
  onSave: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setText(value), [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const commit = () => {
    setEditing(false);
    if (text !== value) onSave(text);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setText(value); setEditing(false); }
        }}
        placeholder={placeholder}
        className={`border border-neutral-300 px-1 py-0.5 font-serif text-sm focus:outline-none focus:border-black ${extraClass || ""}`}
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className={`font-serif text-sm cursor-text hover:underline decoration-neutral-300 ${extraClass || ""}`}
      title="Click to edit"
    >
      {value || <span className="text-neutral-300">{placeholder || "—"}</span>}
    </span>
  );
}

// ─── Layout Dropdown ─────────────────────────────────────────

function LayoutDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-neutral-300 px-1 py-0.5 font-serif text-xs focus:outline-none focus:border-black bg-white"
    >
      <option value="left">Left</option>
      <option value="center">Center</option>
      <option value="right">Right</option>
      <option value="full">Full</option>
    </select>
  );
}

// ─── Draggable List ──────────────────────────────────────────

function DraggableList<T extends { id: number }>({
  items,
  renderItem,
  onReorder,
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onReorder: (ids: number[]) => void;
}) {
  const [localItems, setLocalItems] = useState(items);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const isDragging = useRef(false);

  // Sync local items with props when not dragging
  useEffect(() => {
    if (!isDragging.current) setLocalItems(items);
  }, [items]);

  const handleDragStart = (e: React.DragEvent, idx: number) => {
    isDragging.current = true;
    setDragIdx(idx);
    setOverIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    // Make drag image semi-transparent
    const el = e.currentTarget.closest('[data-drag-row]') as HTMLElement;
    if (el) {
      e.dataTransfer.setDragImage(el, 20, 20);
    }
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragIdx === null || overIdx === idx) return;
    // Reorder locally for instant visual feedback
    setLocalItems((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((i) => i.id === items[dragIdx].id);
      if (fromIdx === -1 || fromIdx === idx) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(idx, 0, moved);
      return next;
    });
    setOverIdx(idx);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Save new order to database
    onReorder(localItems.map((i) => i.id));
    setDragIdx(null);
    setOverIdx(null);
    isDragging.current = false;
  };

  const handleDragEnd = () => {
    if (isDragging.current) {
      // If dropped outside, revert
      setLocalItems(items);
    }
    setDragIdx(null);
    setOverIdx(null);
    isDragging.current = false;
  };

  const draggedId = dragIdx !== null ? items[dragIdx]?.id : null;

  return (
    <div className="flex flex-col gap-1">
      {localItems.map((item, idx) => (
        <div
          key={item.id}
          data-drag-row
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={handleDrop}
          className={`border bg-white flex items-center transition-all duration-150 ${
            draggedId === item.id
              ? "opacity-40 border-black scale-[0.98]"
              : overIdx !== null && draggedId !== item.id
              ? "border-neutral-200"
              : "border-neutral-200"
          }`}
        >
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, idx)}
            onDragEnd={handleDragEnd}
            className="px-2 py-3 cursor-grab active:cursor-grabbing text-neutral-400 hover:text-neutral-700 select-none shrink-0 text-lg"
            title="Drag to reorder"
          >
            ⠿
          </div>
          <div className="flex-1 min-w-0 py-2 pr-3">
            {renderItem(item, idx)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Delete Button ───────────────────────────────────────────

function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="font-serif text-[10px] px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50 shrink-0"
    >
      ✕
    </button>
  );
}

// ─── Toggle Button ───────────────────────────────────────────

function ToggleBtn({ active, labelOn, labelOff, onClick }: { active: boolean; labelOn: string; labelOff: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`font-serif text-xs px-2 py-1 border shrink-0 ${
        active ? "border-green-500 text-green-700" : "border-neutral-300 text-neutral-400"
      }`}
    >
      {active ? labelOn : labelOff}
    </button>
  );
}

// ─── Landing Tab ─────────────────────────────────────────────

function LandingTab({ toast }: { toast: (m: string) => void }) {
  const qc = useQueryClient();
  const { confirm, dialog } = useConfirm();
  const globalCopyright = useGlobalCopyright();

  const { data: images = [] } = useQuery({
    queryKey: ["admin-landing-images"],
    queryFn: async () => {
      const { data } = await supabase.from("landing_images").select("*").order("sort_order");
      return data || [];
    },
  });

  const handleUpload = async (files: { url: string; aspectRatio: number }[]) => {
    const startOrder = images.length;
    const rows = files.map((f, i) => ({
      src: f.url,
      aspect_ratio: f.aspectRatio,
      layout: "center",
      sort_order: startOrder + i,
    }));
    await adminApi({ action: "insert", table: "landing_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const update = async (id: number, data: Record<string, unknown>) => {
    await adminApi({ action: "update", table: "landing_images", id, data });
    qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
    toast("Saved");
  };

  const handleDelete = async (id: number) => {
    if (await confirm("Are you sure you want to delete this image?")) {
      await adminApi({ action: "delete", table: "landing_images", id });
      qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
      toast("Deleted");
    }
  };

  const reorder = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "landing_images", ids });
    qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
  };

  return (
    <div className="space-y-6">
      {dialog}
      <h2 className="font-serif text-lg">Landing Images</h2>
      <ImageUploader onUpload={handleUpload} />
      <DraggableList
        items={images}
        onReorder={reorder}
        renderItem={(img) => (
          <div className="flex items-center gap-3">
            <img src={img.src} alt="" className="w-12 h-12 object-cover shrink-0 rounded-sm" />
            <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
              <InlineField value={img.name || ""} placeholder="Name" onSave={(v) => update(img.id, { name: v })} className="w-28" />
              <InlineField value={(img as any).copyright || ""} placeholder={`© ${globalCopyright}`} onSave={(v) => update(img.id, { copyright: v })} className="w-28 text-neutral-500" />
              <InlineField value={img.year || ""} placeholder="Year" onSave={(v) => update(img.id, { year: v })} className="w-20" />
              <LayoutDropdown value={img.layout} onChange={(v) => update(img.id, { layout: v })} />
            </div>
            <ToggleBtn active={img.published ?? true} labelOn="Visible" labelOff="Hidden" onClick={() => update(img.id, { published: !(img.published ?? true) })} />
            <DeleteBtn onClick={() => handleDelete(img.id)} />
          </div>
        )}
      />
    </div>
  );
}

// ─── Editorial Tab ───────────────────────────────────────────

function EditorialTab({ toast }: { toast: (m: string) => void }) {
  const qc = useQueryClient();
  const { confirm, dialog } = useConfirm();
  const globalCopyright = useGlobalCopyright();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-editorial-projects"],
    queryFn: async () => {
      const { data } = await supabase.from("editorial_projects").select("*").order("sort_order");
      return data || [];
    },
  });

  const { data: images = [] } = useQuery({
    queryKey: ["admin-editorial-images", expandedSlug],
    queryFn: async () => {
      if (!expandedSlug) return [];
      const { data } = await supabase.from("editorial_images").select("*").eq("project_slug", expandedSlug).order("sort_order");
      return data || [];
    },
    enabled: !!expandedSlug,
  });

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi({
      action: "insert",
      table: "editorial_projects",
      data: {
        title, subtitle: subtitle || null,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        year: year || null, thumbnail: "https://placehold.co/400x600",
        sort_order: projects.length,
      },
    });
    setShowForm(false); setTitle(""); setSubtitle(""); setSlug(""); setYear("");
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
    toast("Project added");
  };

  const updateProject = async (id: number, data: Record<string, unknown>) => {
    await adminApi({ action: "update", table: "editorial_projects", id, data });
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
    toast("Saved");
  };

  const deleteProject = async (id: number) => {
    if (await confirm("Delete this project and all its images?")) {
      await adminApi({ action: "delete", table: "editorial_projects", id });
      qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
      toast("Deleted");
    }
  };

  const reorderProjects = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "editorial_projects", ids });
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
  };

  const handleImageUpload = async (projectSlug: string, files: { url: string; aspectRatio: number }[]) => {
    const startOrder = images.length;
    const rows = files.map((f, i) => ({
      project_slug: projectSlug, src: f.url, src_large: f.url,
      aspect_ratio: f.aspectRatio, sort_order: startOrder + i,
    }));
    await adminApi({ action: "insert", table: "editorial_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-editorial-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const deleteImage = async (id: number) => {
    if (await confirm("Are you sure?")) {
      await adminApi({ action: "delete", table: "editorial_images", id });
      qc.invalidateQueries({ queryKey: ["admin-editorial-images"] });
      toast("Deleted");
    }
  };

  const setThumbnail = async (projectId: number, url: string) => {
    await adminApi({ action: "update", table: "editorial_projects", id: projectId, data: { thumbnail: url } });
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
    toast("Cover set");
  };

  const reorderImages = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "editorial_images", ids });
    qc.invalidateQueries({ queryKey: ["admin-editorial-images"] });
  };

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-lg">Editorial Projects</h2>
        <button onClick={() => setShowForm(!showForm)} className="font-serif text-sm border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors">
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProject} className="border border-neutral-200 p-4 space-y-3">
          <input value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }} placeholder="Title" required className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black" />
          <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle (optional)" className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black" />
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" required className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black" />
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year (optional)" className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black" />
          <button type="submit" className="bg-black text-white font-serif text-sm px-4 py-2 hover:bg-neutral-800">Create</button>
        </form>
      )}

      <DraggableList
        items={projects}
        onReorder={reorderProjects}
        renderItem={(project) => (
          <div>
            <div className="flex items-center gap-3">
              <img src={project.thumbnail} alt="" className="w-12 h-12 object-cover shrink-0 rounded-sm" />
              <div className="flex-1 min-w-0 flex items-center gap-3 flex-wrap">
                <InlineField value={project.title} placeholder="Title" onSave={(v) => updateProject(project.id, { title: v })} className="font-bold" />
                <InlineField value={project.subtitle || ""} placeholder="Subtitle" onSave={(v) => updateProject(project.id, { subtitle: v || null })} className="text-neutral-500" />
                <InlineField value={project.year || ""} placeholder="Year" onSave={(v) => updateProject(project.id, { year: v || null })} className="w-16" />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ToggleBtn active={project.published ?? true} labelOn="Published" labelOff="Draft" onClick={() => updateProject(project.id, { published: !(project.published ?? true) })} />
                <button onClick={() => setExpandedSlug(expandedSlug === project.slug ? null : project.slug)} className="font-serif text-xs px-2 py-1 border border-neutral-300 hover:border-black">
                  {expandedSlug === project.slug ? "Close" : "Images"}
                </button>
                <DeleteBtn onClick={() => deleteProject(project.id)} />
              </div>
            </div>

            {expandedSlug === project.slug && (
              <div className="mt-4 ml-6 space-y-3">
                <ImageUploader onUpload={(files) => handleImageUpload(project.slug, files)} />
                <DraggableList
                  items={images}
                  onReorder={reorderImages}
                  renderItem={(img) => (
                    <div className="flex items-center gap-3">
                      <img src={img.src} alt="" className="w-12 h-12 object-cover shrink-0 rounded-sm" />
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <InlineField value={img.name || ""} placeholder="Name" onSave={(name) => { adminApi({ action: "update", table: "editorial_images", id: img.id, data: { name } }); qc.invalidateQueries({ queryKey: ["admin-editorial-images"] }); toast("Saved"); }} />
                        <InlineField value={(img as any).copyright || ""} placeholder={`© ${globalCopyright}`} onSave={(v) => { adminApi({ action: "update", table: "editorial_images", id: img.id, data: { copyright: v } }); qc.invalidateQueries({ queryKey: ["admin-editorial-images"] }); toast("Saved"); }} className="w-28 text-neutral-500" />
                      </div>
                      <button
                        onClick={() => setThumbnail(project.id, img.src)}
                        className={`font-serif text-[10px] px-2 py-1 border shrink-0 ${project.thumbnail === img.src ? "border-yellow-500 text-yellow-700 bg-yellow-50" : "border-neutral-300 hover:border-black"}`}
                      >
                        {project.thumbnail === img.src ? "★ Cover" : "Set cover"}
                      </button>
                      <DeleteBtn onClick={() => deleteImage(img.id)} />
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}

// ─── Journey Tab ─────────────────────────────────────────────

function JourneyTab({ toast }: { toast: (m: string) => void }) {
  const qc = useQueryClient();
  const { confirm, dialog } = useConfirm();
  const globalCopyright = useGlobalCopyright();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-journey-projects"],
    queryFn: async () => {
      const { data } = await supabase.from("journey_projects").select("*").order("sort_order");
      return data || [];
    },
  });

  const { data: images = [] } = useQuery({
    queryKey: ["admin-journey-images", expandedSlug],
    queryFn: async () => {
      if (!expandedSlug) return [];
      const { data } = await supabase.from("journey_images").select("*").eq("project_slug", expandedSlug).order("sort_order");
      return data || [];
    },
    enabled: !!expandedSlug,
  });

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi({
      action: "insert", table: "journey_projects",
      data: { title, slug: slug || title.toLowerCase().replace(/\s+/g, "-"), thumbnail: "https://placehold.co/400x600", sort_order: projects.length },
    });
    setShowForm(false); setTitle(""); setSlug("");
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
    toast("Project added");
  };

  const updateProject = async (id: number, data: Record<string, unknown>) => {
    await adminApi({ action: "update", table: "journey_projects", id, data });
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
    toast("Saved");
  };

  const deleteProject = async (id: number) => {
    if (await confirm("Delete this project and all its images?")) {
      await adminApi({ action: "delete", table: "journey_projects", id });
      qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
      toast("Deleted");
    }
  };

  const reorderProjects = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "journey_projects", ids });
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
  };

  const handleImageUpload = async (projectSlug: string, files: { url: string; aspectRatio: number }[]) => {
    const startOrder = images.length;
    const rows = files.map((f, i) => ({
      project_slug: projectSlug, src: f.url, src_large: f.url,
      aspect_ratio: f.aspectRatio, sort_order: startOrder + i,
    }));
    await adminApi({ action: "insert", table: "journey_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-journey-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const deleteImage = async (id: number) => {
    if (await confirm("Are you sure?")) {
      await adminApi({ action: "delete", table: "journey_images", id });
      qc.invalidateQueries({ queryKey: ["admin-journey-images"] });
      toast("Deleted");
    }
  };

  const setThumbnail = async (projectId: number, url: string) => {
    await adminApi({ action: "update", table: "journey_projects", id: projectId, data: { thumbnail: url } });
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
    toast("Cover set");
  };

  const reorderImages = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "journey_images", ids });
    qc.invalidateQueries({ queryKey: ["admin-journey-images"] });
  };

  return (
    <div className="space-y-6">
      {dialog}
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-lg">Journey Projects</h2>
        <button onClick={() => setShowForm(!showForm)} className="font-serif text-sm border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors">
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProject} className="border border-neutral-200 p-4 space-y-3">
          <input value={title} onChange={(e) => { setTitle(e.target.value); if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }} placeholder="Title" required className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black" />
          <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" required className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black" />
          <button type="submit" className="bg-black text-white font-serif text-sm px-4 py-2 hover:bg-neutral-800">Create</button>
        </form>
      )}

      <DraggableList
        items={projects}
        onReorder={reorderProjects}
        renderItem={(project) => (
          <div>
            <div className="flex items-center gap-3">
              <img src={project.thumbnail} alt="" className="w-12 h-12 object-cover shrink-0 rounded-sm" />
              <div className="flex-1 min-w-0">
                <InlineField value={project.title} placeholder="Title" onSave={(v) => updateProject(project.id, { title: v })} className="font-bold" />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ToggleBtn active={project.published ?? true} labelOn="Published" labelOff="Draft" onClick={() => updateProject(project.id, { published: !(project.published ?? true) })} />
                <button onClick={() => setExpandedSlug(expandedSlug === project.slug ? null : project.slug)} className="font-serif text-xs px-2 py-1 border border-neutral-300 hover:border-black">
                  {expandedSlug === project.slug ? "Close" : "Images"}
                </button>
                <DeleteBtn onClick={() => deleteProject(project.id)} />
              </div>
            </div>

            {expandedSlug === project.slug && (
              <div className="mt-4 ml-6 space-y-3">
                <ImageUploader onUpload={(files) => handleImageUpload(project.slug, files)} />
                <DraggableList
                  items={images}
                  onReorder={reorderImages}
                  renderItem={(img) => (
                    <div className="flex items-center gap-3">
                      <img src={img.src} alt="" className="w-12 h-12 object-cover shrink-0 rounded-sm" />
                      <div className="flex-1 min-w-0 flex items-center gap-3">
                        <InlineField value={img.name || ""} placeholder="Name" onSave={(name) => { adminApi({ action: "update", table: "journey_images", id: img.id, data: { name } }); qc.invalidateQueries({ queryKey: ["admin-journey-images"] }); toast("Saved"); }} />
                        <InlineField value={(img as any).copyright || ""} placeholder={`© ${globalCopyright}`} onSave={(v) => { adminApi({ action: "update", table: "journey_images", id: img.id, data: { copyright: v } }); qc.invalidateQueries({ queryKey: ["admin-journey-images"] }); toast("Saved"); }} className="w-28 text-neutral-500" />
                      </div>
                      <button
                        onClick={() => setThumbnail(project.id, img.src)}
                        className={`font-serif text-[10px] px-2 py-1 border shrink-0 ${project.thumbnail === img.src ? "border-yellow-500 text-yellow-700 bg-yellow-50" : "border-neutral-300 hover:border-black"}`}
                      >
                        {project.thumbnail === img.src ? "★ Cover" : "Set cover"}
                      </button>
                      <DeleteBtn onClick={() => deleteImage(img.id)} />
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        )}
      />
    </div>
  );
}

// ─── Notes Tab ───────────────────────────────────────────────

function NotesTab({ toast }: { toast: (m: string) => void }) {
  const qc = useQueryClient();
  const { confirm, dialog } = useConfirm();
  const globalCopyright = useGlobalCopyright();
  const [yearInput, setYearInput] = useState("");

  const { data: images = [] } = useQuery({
    queryKey: ["admin-notes-images"],
    queryFn: async () => {
      const { data } = await supabase.from("notes_images").select("*").order("year").order("sort_order");
      return data || [];
    },
  });

  const years = [...new Set(images.map((img) => img.year))];

  const handleUpload = async (files: { url: string; aspectRatio: number }[]) => {
    if (!yearInput.trim()) { toast("Please enter a year first"); return; }
    const sameYear = images.filter((img) => img.year === yearInput);
    const rows = files.map((f, i) => ({
      src: f.url, src_large: f.url, aspect_ratio: f.aspectRatio,
      year: yearInput, sort_order: sameYear.length + i,
    }));
    await adminApi({ action: "insert", table: "notes_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-notes-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const handleDelete = async (id: number) => {
    if (await confirm("Are you sure?")) {
      await adminApi({ action: "delete", table: "notes_images", id });
      qc.invalidateQueries({ queryKey: ["admin-notes-images"] });
      toast("Deleted");
    }
  };

  const update = async (id: number, data: Record<string, unknown>) => {
    await adminApi({ action: "update", table: "notes_images", id, data });
    qc.invalidateQueries({ queryKey: ["admin-notes-images"] });
    toast("Saved");
  };

  return (
    <div className="space-y-6">
      {dialog}
      <h2 className="font-serif text-lg">Notes Images</h2>
      <div className="flex gap-3 items-end">
        <div>
          <label className="font-serif text-xs text-neutral-500 block mb-1">Year for new uploads</label>
          <input value={yearInput} onChange={(e) => setYearInput(e.target.value)} placeholder="e.g. 2024" className="border border-neutral-300 px-3 py-2 font-serif text-sm w-40 focus:outline-none focus:border-black" />
        </div>
      </div>
      <ImageUploader onUpload={handleUpload} />

      {years.map((year) => {
        const yearImages = images.filter((img) => img.year === year);
        return (
          <div key={year} className="space-y-2">
            <h3 className="font-serif text-sm font-bold border-b border-neutral-200 pb-1">{year}</h3>
            <DraggableList
              items={yearImages}
              onReorder={async (ids) => {
                await adminApi({ action: "reorder", table: "notes_images", ids });
                qc.invalidateQueries({ queryKey: ["admin-notes-images"] });
              }}
              renderItem={(img) => (
                <div className="flex items-center gap-3">
                  <img src={img.src} alt="" className="w-12 h-12 object-cover shrink-0 rounded-sm" />
                  <div className="flex-1 min-w-0 flex items-center gap-3">
                    <InlineField value={img.name || ""} placeholder="Name" onSave={(name) => update(img.id, { name })} />
                    <InlineField value={(img as any).copyright || ""} placeholder={`© ${globalCopyright}`} onSave={(v) => update(img.id, { copyright: v })} className="w-28 text-neutral-500" />
                    <InlineField value={img.year} placeholder="Year" onSave={(y) => update(img.id, { year: y })} className="w-24" />
                  </div>
                  <DeleteBtn onClick={() => handleDelete(img.id)} />
                </div>
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────

function SettingsTab({ toast }: { toast: (m: string) => void }) {
  const qc = useQueryClient();

  const { data: copyright = "© Jan Khür" } = useQuery({
    queryKey: ["site-settings-copyright"],
    queryFn: async () => {
      const { data } = await supabase
        .from("site_settings" as any)
        .select("value")
        .eq("key", "copyright")
        .single();
      return (data as any)?.value || "© Jan Khür";
    },
  });

  const saveCopyright = async (value: string) => {
    await adminApi({
      action: "update",
      table: "site_settings",
      id: "copyright",
      data: { value },
    });
    qc.invalidateQueries({ queryKey: ["site-settings-copyright"] });
    toast("Saved");
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-lg">Settings</h2>
      <div>
        <label className="font-serif text-xs text-neutral-500 block mb-2">
          Default copyright applied to all new image uploads
        </label>
        <div className="flex items-center gap-2">
          <span className="font-serif text-sm text-neutral-500">Copyright</span>
          <InlineField value={copyright} placeholder="© Jan Khür" onSave={saveCopyright} className="w-64" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────

const Admin = () => {
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("admin_password"));
  const { msg, show } = useToastMessage();

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-2xl">Admin</h1>
          <button onClick={() => { sessionStorage.removeItem("admin_password"); setAuthed(false); }} className="font-serif text-sm text-neutral-400 hover:text-black">
            Logout
          </button>
        </div>

        <Tabs defaultValue="editorial">
          <TabsList className="bg-transparent border-b border-neutral-200 rounded-none w-full justify-start gap-0 h-auto p-0">
            {["editorial", "journey", "notes", "landing", "settings"].map((tab) => (
              <TabsTrigger key={tab} value={tab} className="font-serif text-sm capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mt-8">
            <TabsContent value="editorial"><EditorialTab toast={show} /></TabsContent>
            <TabsContent value="journey"><JourneyTab toast={show} /></TabsContent>
            <TabsContent value="notes"><NotesTab toast={show} /></TabsContent>
            <TabsContent value="landing"><LandingTab toast={show} /></TabsContent>
            <TabsContent value="settings"><SettingsTab toast={show} /></TabsContent>
          </div>
        </Tabs>
      </div>
      {msg && <Toast message={msg} />}
    </div>
  );
};

export default Admin;
