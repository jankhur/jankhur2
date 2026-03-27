import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SketchCursor from "@/components/SketchCursor";
import { fetchNotesImages } from "@/lib/queries";
import { useIsMobile } from "@/hooks/use-mobile";

interface NoteImage {
  id: number;
  src: string;
  src_large: string;
  aspect_ratio: number;
  year: string;
}

/* ─── Desktop: horizontal scroll (unchanged logic) ─────────── */

function NotesDesktop({ notesImages, years }: { notesImages: NoteImage[]; years: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentYear, setCurrentYear] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    if (years.length > 0 && !currentYear) setCurrentYear(years[0]);
  }, [years, currentYear]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    const onScroll = () => {
      if (el.scrollLeft > 30) setHasScrolled(true);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || years.length === 0) return;
    const onScroll = () => {
      const containerRect = el.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      const images = el.querySelectorAll<HTMLElement>("[data-year]");
      let closestDist = Infinity;
      let closestYear = years[0];
      images.forEach((img) => {
        const rect = img.getBoundingClientRect();
        const imgCenter = rect.left + rect.width / 2;
        const dist = Math.abs(imgCenter - centerX);
        if (dist < closestDist) {
          closestDist = dist;
          closestYear = img.dataset.year || years[0];
        }
      });
      setCurrentYear(closestYear);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [years]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = { isDown: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false };
    setIsDragging(true);
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState.current.isDown) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - dragState.current.startX) * 1.5;
    if (Math.abs(walk) > 5) dragState.current.moved = true;
    el.scrollLeft = dragState.current.scrollLeft - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    dragState.current.isDown = false;
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  const jumpToYear = useCallback((year: string) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-year="${year}"]`);
    if (target) {
      el.scrollTo({ left: target.offsetLeft - 100, behavior: "smooth" });
    }
  }, []);

  const handleAreaClick = useCallback((e: React.MouseEvent) => {
    if (dragState.current.moved) return;
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

  return (
    <>
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
        onClick={handleAreaClick}
      >
        <div className="shrink-0 w-[15vw]" />
        {notesImages.map((img, i) => (
          <div key={img.id} data-year={img.year} className="shrink-0 h-full px-3 md:px-5 flex items-center justify-center py-4">
            <img
              src={img.src}
              alt={`Notes — ${img.year}`}
              draggable={false}
              loading={i < 5 ? "eager" : "lazy"}
              className="h-full w-auto object-contain select-none transition-opacity duration-500"
              style={{ maxWidth: "90vw", cursor: isDragging ? "grabbing" : "pointer" }}
            />
          </div>
        ))}
        <div className="shrink-0 w-[30vw]" />
      </div>

      <div className="fixed bottom-12 left-6 md:left-10 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentYear}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-2xl md:text-3xl text-foreground tracking-wide"
          >
            {currentYear}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="fixed bottom-8 right-6 md:right-10 z-30 flex gap-6 items-center">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => jumpToYear(year)}
            className={`font-serif tracking-[0.1em] transition-all duration-300 ${
              currentYear === year ? "text-lg md:text-xl text-red-600 opacity-100" : "text-base md:text-lg text-foreground opacity-100 hover:opacity-60"
            }`}
          >
            {year}
          </button>
        ))}
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
    </>
  );
}

/* ─── Mobile: vertical scroll with year sidebar ────────────── */

function NotesMobile({ notesImages, years }: { notesImages: NoteImage[]; years: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentYear, setCurrentYear] = useState(years[0] || "");

  // Track which year is visible based on scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || years.length === 0) return;

    const onScroll = () => {
      const headings = el.querySelectorAll<HTMLElement>("[data-year-heading]");
      let active = years[0];
      headings.forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        if (rect.top <= 140) {
          active = heading.dataset.yearHeading || active;
        }
      });
      setCurrentYear(active);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [years]);

  const jumpToYear = useCallback((year: string) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-year-heading="${year}"]`);
    if (target) {
      const containerTop = el.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      el.scrollTo({ top: el.scrollTop + (targetTop - containerTop) - 8, behavior: "smooth" });
    }
  }, []);

  // Group images by year
  const imagesByYear = useMemo(() => {
    const map = new Map<string, NoteImage[]>();
    for (const img of notesImages) {
      if (!map.has(img.year)) map.set(img.year, []);
      map.get(img.year)!.push(img);
    }
    return map;
  }, [notesImages]);

  return (
    <>
      {/* Main year display - bottom left */}
      <div className="fixed bottom-5 left-5 z-30 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentYear}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="font-serif text-2xl text-foreground tracking-wide"
          >
            {currentYear}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Year sidebar - right side, vertical */}
      <div className="fixed right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3 items-center">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => jumpToYear(year)}
            className={`font-serif tracking-[0.05em] transition-all duration-300 ${
              currentYear === year
                ? "text-sm text-red-600 opacity-100"
                : "text-xs text-foreground opacity-70"
            }`}
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Scrollable vertical gallery */}
      <div
        ref={scrollRef}
        className="absolute inset-0 top-14 bottom-0 overflow-y-auto overflow-x-hidden pr-10"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {years.map((year) => (
          <div key={year} data-year-heading={year}>
            {(imagesByYear.get(year) || []).map((img, i) => (
              <div key={img.id} className="px-4 pb-3">
                <img
                  src={img.src}
                  alt={`Notes — ${img.year}`}
                  loading={i < 3 ? "eager" : "lazy"}
                  className="w-full h-auto object-contain select-none"
                />
              </div>
            ))}
          </div>
        ))}
        <div className="h-16" />
      </div>
    </>
  );
}

/* ─── Main Notes Component ─────────────────────────────────── */

const Notes = () => {
  const isMobile = useIsMobile();

  const { data: dbImages } = useQuery({
    queryKey: ["notes-images"],
    queryFn: fetchNotesImages,
  });

  const notesImages: NoteImage[] = useMemo(
    () =>
      (dbImages || []).map((img) => ({
        id: img.id,
        src: img.src,
        src_large: img.src_large,
        aspect_ratio: Number(img.aspect_ratio),
        year: img.year,
      })),
    [dbImages]
  );

  const years = useMemo(() => [...new Set(notesImages.map((img) => img.year))], [notesImages]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Header showName />
      <SketchCursor type="notes" />

      {isMobile ? (
        <NotesMobile notesImages={notesImages} years={years} />
      ) : (
        <NotesDesktop notesImages={notesImages} years={years} />
      )}

      <style>{`div::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
};

export default Notes;
