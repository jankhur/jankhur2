import { useRef, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SketchCursor from "@/components/SketchCursor";
import { fetchEditorialImages, fetchEditorialProjects } from "@/lib/queries";
import { arildImages } from "@/data/editorialData";
import { editorialProjects } from "@/data/editorialProjects";

const EditorialGallery = () => {
  const { slug } = useParams<{ slug: string }>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  const { data: supabaseProject } = useQuery({
    queryKey: ["editorial-projects"],
    queryFn: fetchEditorialProjects,
  });

  const { data: supabaseImages, isLoading } = useQuery({
    queryKey: ["editorial-images", slug],
    queryFn: () => fetchEditorialImages(slug || ""),
    enabled: !!slug,
  });

  // Resolve project info: Supabase first, then static fallback
  const project = supabaseProject?.find((p) => p.slug === slug);
  const staticProject = editorialProjects.find((p) => p.slug === slug);
  const title = project?.title || staticProject?.title || slug || "";
  const subtitle = project?.subtitle || staticProject?.subtitle || "";

  // Resolve images: Supabase first, then static fallback
  const images = (() => {
    if (supabaseImages && supabaseImages.length > 0) {
      return supabaseImages.map((img) => ({
        id: String(img.id),
        src: img.src,
        srcLarge: img.src_large || img.src,
        aspectRatio: Number(img.aspect_ratio),
      }));
    }
    // Static fallback
    if (slug === "arild") return arildImages;
    return [];
  })();

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      if (el.scrollLeft > 30) setHasScrolled(true);
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft };
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    dragState.current.isDown = false;
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (dragState.current.isDown) return;
    const el = scrollRef.current;
    if (!el) return;
    const clickX = e.clientX;
    const midpoint = window.innerWidth / 2;
    const scrollAmount = window.innerWidth * 0.6;
    el.scrollTo({
      left: el.scrollLeft + (clickX > midpoint ? scrollAmount : -scrollAmount),
      behavior: "smooth",
    });
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <span className="font-serif text-sm text-foreground">Loading…</span>
      </div>
    );
  }

  if (!isLoading && images.length === 0) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center">
        <Header showName />
        <p className="text-foreground font-serif text-sm">Gallery not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Header showName />
      <SketchCursor type="editorial" />

      <div
        ref={scrollRef}
        className="absolute inset-0 top-16 bottom-20 overflow-x-auto overflow-y-hidden flex items-center justify-start"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          scrollBehavior: "auto",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClick={handleClick}
      >
        <div className="shrink-0 w-[15vw]" />

        {images.map((img, i) => (
          <div key={img.id} className="shrink-0 h-full px-3 md:px-5 flex items-center justify-center py-4">
            <img
              src={img.src}
              alt={`${title} — ${i + 1}`}
              draggable={false}
              loading={i < 5 ? "eager" : "lazy"}
              className="h-full w-auto object-contain select-none transition-opacity duration-500"
              style={{ maxWidth: "90vw", cursor: isDragging ? "grabbing" : "default" }}
            />
          </div>
        ))}

        <div className="shrink-0 w-[30vw]" />
      </div>

      <div className="fixed bottom-12 left-6 md:left-10 z-30 pointer-events-none">
        <span className="font-serif text-base md:text-lg text-foreground">
          <span className="font-bold">{title}</span>
          {subtitle && (
            <span className="font-normal text-muted-foreground">, {subtitle}</span>
          )}
        </span>
      </div>

      <AnimatePresence>
        {!hasScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="fixed top-1/2 -translate-y-1/2 left-0 z-30 pointer-events-none md:hidden"
          >
            <motion.svg
              width="140"
              height="32"
              viewBox="0 0 140 32"
              fill="none"
              className="text-foreground"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.path
                d="M0 16 C20 16, 30 8, 50 8 C70 8, 70 24, 90 16 L130 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
              <motion.path
                d="M122 8 L134 16 L122 24"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </motion.svg>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default EditorialGallery;
