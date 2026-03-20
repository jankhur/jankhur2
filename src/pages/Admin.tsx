import { useState, useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminApi, uploadImage, getAspectRatio } from "@/lib/adminApi";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ─── Auth Gate ───────────────────────────────────────────────

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("admin_password", pw);
    try {
      // Test the password by making a dummy call
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
      // 400 = unknown action = password was correct
      // 401 = bad password
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
            <div
              className="bg-black h-1 transition-all"
              style={{ width: `${progress}%` }}
            />
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

// ─── Inline Editable Name ────────────────────────────────────

function InlineName({
  value,
  onSave,
}: {
  value: string;
  onSave: (name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  const commit = () => {
    setEditing(false);
    if (text !== value) onSave(text);
  };

  if (editing) {
    return (
      <input
        autoFocus
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") { setText(value); setEditing(false); }
        }}
        className="border border-neutral-300 px-1 py-0.5 font-serif text-sm w-full focus:outline-none focus:border-black"
      />
    );
  }

  return (
    <span
      onClick={() => setEditing(true)}
      className="font-serif text-sm truncate cursor-text hover:underline"
      title="Click to rename"
    >
      {value || "Untitled"}
    </span>
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
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const handleDragStart = (idx: number) => setDragIdx(idx);

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const newItems = [...items];
    const [moved] = newItems.splice(dragIdx, 1);
    newItems.splice(idx, 0, moved);
    setDragIdx(idx);
    onReorder(newItems.map((i) => i.id));
  };

  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDragEnd={() => setDragIdx(null)}
          className={`border border-neutral-200 p-3 bg-white cursor-grab active:cursor-grabbing ${
            dragIdx === idx ? "opacity-50" : ""
          }`}
        >
          {renderItem(item, idx)}
        </div>
      ))}
    </div>
  );
}

// ─── Editorial Tab ───────────────────────────────────────────

function EditorialTab({ toast }: { toast: (m: string) => void }) {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [year, setYear] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-editorial-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("editorial_projects")
        .select("*")
        .order("sort_order");
      return data || [];
    },
  });

  const { data: images = [] } = useQuery({
    queryKey: ["admin-editorial-images", expandedSlug],
    queryFn: async () => {
      if (!expandedSlug) return [];
      const { data } = await supabase
        .from("editorial_images")
        .select("*")
        .eq("project_slug", expandedSlug)
        .order("sort_order");
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
        title,
        subtitle: subtitle || null,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        year: year || null,
        thumbnail: "https://placehold.co/400x600",
        sort_order: projects.length,
      },
    });
    setShowForm(false);
    setTitle("");
    setSubtitle("");
    setSlug("");
    setYear("");
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
    toast("Project added");
  };

  const deleteProject = async (id: number) => {
    await adminApi({ action: "delete", table: "editorial_projects", id });
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
    toast("Project deleted");
  };

  const togglePublished = async (id: number, current: boolean) => {
    await adminApi({
      action: "update",
      table: "editorial_projects",
      id,
      data: { published: !current },
    });
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
    toast(current ? "Unpublished" : "Published");
  };

  const reorderProjects = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "editorial_projects", ids });
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
  };

  const handleImageUpload = async (
    slug: string,
    files: { url: string; aspectRatio: number }[]
  ) => {
    const startOrder = images.length;
    const rows = files.map((f, i) => ({
      project_slug: slug,
      src: f.url,
      src_large: f.url,
      aspect_ratio: f.aspectRatio,
      sort_order: startOrder + i,
    }));
    await adminApi({ action: "insert", table: "editorial_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-editorial-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const deleteImage = async (id: number) => {
    await adminApi({ action: "delete", table: "editorial_images", id });
    qc.invalidateQueries({ queryKey: ["admin-editorial-images"] });
    toast("Image deleted");
  };

  const setThumbnail = async (projectId: number, url: string) => {
    await adminApi({
      action: "update",
      table: "editorial_projects",
      id: projectId,
      data: { thumbnail: url },
    });
    qc.invalidateQueries({ queryKey: ["admin-editorial-projects"] });
    toast("Thumbnail set");
  };

  const reorderImages = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "editorial_images", ids });
    qc.invalidateQueries({ queryKey: ["admin-editorial-images"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-lg">Editorial Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-serif text-sm border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProject} className="border border-neutral-200 p-4 space-y-3">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            placeholder="Title"
            required
            className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
          />
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle (optional)"
            className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            required
            className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
          />
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year (optional)"
            className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white font-serif text-sm px-4 py-2 hover:bg-neutral-800"
          >
            Create
          </button>
        </form>
      )}

      <DraggableList
        items={projects}
        onReorder={reorderProjects}
        renderItem={(project) => (
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img
                  src={project.thumbnail}
                  alt=""
                  className="w-12 h-12 object-cover"
                />
                <div>
                  <span className="font-serif text-sm font-bold">{project.title}</span>
                  {project.subtitle && (
                    <span className="font-serif text-sm text-neutral-500">
                      {" "}— {project.subtitle}
                    </span>
                  )}
                  <div className="font-serif text-xs text-neutral-400">
                    /{project.slug} {project.year && `· ${project.year}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    togglePublished(project.id, project.published ?? true)
                  }
                  className={`font-serif text-xs px-2 py-1 border ${
                    project.published
                      ? "border-green-500 text-green-700"
                      : "border-neutral-300 text-neutral-400"
                  }`}
                >
                  {project.published ? "Published" : "Draft"}
                </button>
                <button
                  onClick={() =>
                    setExpandedSlug(
                      expandedSlug === project.slug ? null : project.slug
                    )
                  }
                  className="font-serif text-xs px-2 py-1 border border-neutral-300 hover:border-black"
                >
                  {expandedSlug === project.slug ? "Close" : "Images"}
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="font-serif text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {expandedSlug === project.slug && (
              <div className="mt-4 space-y-3">
                <ImageUploader
                  onUpload={(files) => handleImageUpload(project.slug, files)}
                />
                <DraggableList
                  items={images}
                  onReorder={reorderImages}
                  renderItem={(img) => (
                    <div className="flex items-center gap-3">
                      <img src={img.src} alt="" className="w-16 h-16 object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <InlineName
                          value={img.name || ""}
                          onSave={(name) => {
                            adminApi({ action: "update", table: "editorial_images", id: img.id, data: { name } });
                            qc.invalidateQueries({ queryKey: ["admin-editorial-images"] });
                            toast("Renamed");
                          }}
                        />
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setThumbnail(project.id, img.src)}
                          className="font-serif text-[10px] px-2 py-1 border border-neutral-300 hover:border-black"
                        >
                          Thumb
                        </button>
                        <button
                          onClick={() => deleteImage(img.id)}
                          className="font-serif text-[10px] px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
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
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ["admin-journey-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("journey_projects")
        .select("*")
        .order("sort_order");
      return data || [];
    },
  });

  const { data: images = [] } = useQuery({
    queryKey: ["admin-journey-images", expandedSlug],
    queryFn: async () => {
      if (!expandedSlug) return [];
      const { data } = await supabase
        .from("journey_images")
        .select("*")
        .eq("project_slug", expandedSlug)
        .order("sort_order");
      return data || [];
    },
    enabled: !!expandedSlug,
  });

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await adminApi({
      action: "insert",
      table: "journey_projects",
      data: {
        title,
        slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
        thumbnail: "https://placehold.co/400x600",
        sort_order: projects.length,
      },
    });
    setShowForm(false);
    setTitle("");
    setSlug("");
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
    toast("Project added");
  };

  const deleteProject = async (id: number) => {
    await adminApi({ action: "delete", table: "journey_projects", id });
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
    toast("Project deleted");
  };

  const togglePublished = async (id: number, current: boolean) => {
    await adminApi({
      action: "update",
      table: "journey_projects",
      id,
      data: { published: !current },
    });
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
    toast(current ? "Unpublished" : "Published");
  };

  const reorderProjects = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "journey_projects", ids });
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
  };

  const handleImageUpload = async (
    projectSlug: string,
    files: { url: string; aspectRatio: number }[]
  ) => {
    const startOrder = images.length;
    const rows = files.map((f, i) => ({
      project_slug: projectSlug,
      src: f.url,
      src_large: f.url,
      aspect_ratio: f.aspectRatio,
      sort_order: startOrder + i,
    }));
    await adminApi({ action: "insert", table: "journey_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-journey-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const deleteImage = async (id: number) => {
    await adminApi({ action: "delete", table: "journey_images", id });
    qc.invalidateQueries({ queryKey: ["admin-journey-images"] });
    toast("Image deleted");
  };

  const setThumbnail = async (projectId: number, url: string) => {
    await adminApi({
      action: "update",
      table: "journey_projects",
      id: projectId,
      data: { thumbnail: url },
    });
    qc.invalidateQueries({ queryKey: ["admin-journey-projects"] });
    toast("Thumbnail set");
  };

  const reorderImages = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "journey_images", ids });
    qc.invalidateQueries({ queryKey: ["admin-journey-images"] });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-lg">Journey Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="font-serif text-sm border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Project"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addProject} className="border border-neutral-200 p-4 space-y-3">
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
            }}
            placeholder="Title"
            required
            className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
          />
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="Slug"
            required
            className="w-full border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            className="bg-black text-white font-serif text-sm px-4 py-2 hover:bg-neutral-800"
          >
            Create
          </button>
        </form>
      )}

      <DraggableList
        items={projects}
        onReorder={reorderProjects}
        renderItem={(project) => (
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={project.thumbnail} alt="" className="w-12 h-12 object-cover" />
                <div>
                  <span className="font-serif text-sm font-bold">{project.title}</span>
                  <div className="font-serif text-xs text-neutral-400">/{project.slug}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublished(project.id, project.published ?? true)}
                  className={`font-serif text-xs px-2 py-1 border ${
                    project.published ? "border-green-500 text-green-700" : "border-neutral-300 text-neutral-400"
                  }`}
                >
                  {project.published ? "Published" : "Draft"}
                </button>
                <button
                  onClick={() => setExpandedSlug(expandedSlug === project.slug ? null : project.slug)}
                  className="font-serif text-xs px-2 py-1 border border-neutral-300 hover:border-black"
                >
                  {expandedSlug === project.slug ? "Close" : "Images"}
                </button>
                <button
                  onClick={() => deleteProject(project.id)}
                  className="font-serif text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>

            {expandedSlug === project.slug && (
              <div className="mt-4 space-y-3">
                <ImageUploader onUpload={(files) => handleImageUpload(project.slug, files)} />
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.src} alt="" className="w-full aspect-square object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          onClick={() => setThumbnail(project.id, img.src)}
                          className="text-white text-[10px] font-serif px-1 py-0.5 border border-white/50 hover:bg-white/20"
                        >
                          Thumb
                        </button>
                        <button
                          onClick={() => deleteImage(img.id)}
                          className="text-red-300 text-[10px] font-serif px-1 py-0.5 border border-red-300/50 hover:bg-red-500/20"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
  const [yearInput, setYearInput] = useState("");

  const { data: images = [] } = useQuery({
    queryKey: ["admin-notes-images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("notes_images")
        .select("*")
        .order("year")
        .order("sort_order");
      return data || [];
    },
  });

  const years = [...new Set(images.map((img) => img.year))];

  const handleUpload = async (
    files: { url: string; aspectRatio: number }[]
  ) => {
    if (!yearInput.trim()) {
      toast("Please enter a year first");
      return;
    }
    const sameYearImages = images.filter((img) => img.year === yearInput);
    const startOrder = sameYearImages.length;
    const rows = files.map((f, i) => ({
      src: f.url,
      src_large: f.url,
      aspect_ratio: f.aspectRatio,
      year: yearInput,
      sort_order: startOrder + i,
    }));
    await adminApi({ action: "insert", table: "notes_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-notes-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const deleteImage = async (id: number) => {
    await adminApi({ action: "delete", table: "notes_images", id });
    qc.invalidateQueries({ queryKey: ["admin-notes-images"] });
    toast("Image deleted");
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-lg">Notes Images</h2>

      <div className="flex gap-3 items-end">
        <div>
          <label className="font-serif text-xs text-neutral-500 block mb-1">Year</label>
          <input
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            placeholder="e.g. 2024"
            className="border border-neutral-300 px-3 py-2 font-serif text-sm w-40 focus:outline-none focus:border-black"
          />
        </div>
      </div>

      <ImageUploader onUpload={handleUpload} />

      {years.map((year) => {
        const yearImages = images.filter((img) => img.year === year);
        return (
          <div key={year} className="space-y-2">
            <h3 className="font-serif text-sm font-bold">{year}</h3>
            <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
              {yearImages.map((img) => (
                <div key={img.id} className="relative group">
                  <img src={img.src} alt="" className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => deleteImage(img.id)}
                      className="text-red-300 text-xs font-serif px-2 py-1 border border-red-300/50 hover:bg-red-500/20"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Landing Tab ─────────────────────────────────────────────

function LandingTab({ toast }: { toast: (m: string) => void }) {
  const qc = useQueryClient();
  const [nameInput, setNameInput] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [layoutInput, setLayoutInput] = useState<string>("center");

  const { data: images = [] } = useQuery({
    queryKey: ["admin-landing-images"],
    queryFn: async () => {
      const { data } = await supabase
        .from("landing_images")
        .select("*")
        .order("sort_order");
      return data || [];
    },
  });

  const handleUpload = async (
    files: { url: string; aspectRatio: number }[]
  ) => {
    const startOrder = images.length;
    const rows = files.map((f, i) => ({
      src: f.url,
      aspect_ratio: f.aspectRatio,
      layout: layoutInput,
      name: nameInput || null,
      year: yearInput || null,
      sort_order: startOrder + i,
    }));
    await adminApi({ action: "insert", table: "landing_images", data: rows });
    qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
    toast(`${files.length} image(s) uploaded`);
  };

  const deleteImage = async (id: number) => {
    await adminApi({ action: "delete", table: "landing_images", id });
    qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
    toast("Image deleted");
  };

  const togglePublished = async (id: number, current: boolean) => {
    await adminApi({
      action: "update",
      table: "landing_images",
      id,
      data: { published: !current },
    });
    qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
    toast(current ? "Hidden" : "Shown");
  };

  const reorderImages = async (ids: number[]) => {
    await adminApi({ action: "reorder", table: "landing_images", ids });
    qc.invalidateQueries({ queryKey: ["admin-landing-images"] });
  };

  return (
    <div className="space-y-6">
      <h2 className="font-serif text-lg">Landing Images</h2>

      <div className="flex gap-3 items-end flex-wrap">
        <div>
          <label className="font-serif text-xs text-neutral-500 block mb-1">Name</label>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Image name"
            className="border border-neutral-300 px-3 py-2 font-serif text-sm w-40 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="font-serif text-xs text-neutral-500 block mb-1">Year</label>
          <input
            value={yearInput}
            onChange={(e) => setYearInput(e.target.value)}
            placeholder="e.g. 2024"
            className="border border-neutral-300 px-3 py-2 font-serif text-sm w-24 focus:outline-none focus:border-black"
          />
        </div>
        <div>
          <label className="font-serif text-xs text-neutral-500 block mb-1">Layout</label>
          <select
            value={layoutInput}
            onChange={(e) => setLayoutInput(e.target.value)}
            className="border border-neutral-300 px-3 py-2 font-serif text-sm focus:outline-none focus:border-black"
          >
            <option value="full">Full</option>
            <option value="center">Center</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      <ImageUploader onUpload={handleUpload} />

      <DraggableList
        items={images}
        onReorder={reorderImages}
        renderItem={(img) => (
          <div className="flex items-center gap-3">
            <img src={img.src} alt="" className="w-16 h-16 object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-serif text-sm font-bold truncate">
                {img.name || "Untitled"}
              </div>
              <div className="font-serif text-xs text-neutral-400">
                {img.layout} · {img.year || "—"}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => togglePublished(img.id, img.published ?? true)}
                className={`font-serif text-xs px-2 py-1 border ${
                  img.published ? "border-green-500 text-green-700" : "border-neutral-300 text-neutral-400"
                }`}
              >
                {img.published ? "Visible" : "Hidden"}
              </button>
              <button
                onClick={() => deleteImage(img.id)}
                className="font-serif text-xs px-2 py-1 border border-red-300 text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      />
    </div>
  );
}

// ─── Main Admin Page ─────────────────────────────────────────

const Admin = () => {
  const [authed, setAuthed] = useState(
    () => !!sessionStorage.getItem("admin_password")
  );
  const { msg, show } = useToastMessage();

  if (!authed) return <AdminLogin onAuth={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-2xl">Admin</h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_password");
              setAuthed(false);
            }}
            className="font-serif text-sm text-neutral-400 hover:text-black"
          >
            Logout
          </button>
        </div>

        <Tabs defaultValue="editorial">
          <TabsList className="bg-transparent border-b border-neutral-200 rounded-none w-full justify-start gap-0 h-auto p-0">
            {["editorial", "journey", "notes", "landing"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="font-serif text-sm capitalize rounded-none border-b-2 border-transparent data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-8">
            <TabsContent value="editorial">
              <EditorialTab toast={show} />
            </TabsContent>
            <TabsContent value="journey">
              <JourneyTab toast={show} />
            </TabsContent>
            <TabsContent value="notes">
              <NotesTab toast={show} />
            </TabsContent>
            <TabsContent value="landing">
              <LandingTab toast={show} />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {msg && <Toast message={msg} />}
    </div>
  );
};

export default Admin;
