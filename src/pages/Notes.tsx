import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { notesImages, years, type NoteImage } from "@/data/notesData";

const Notes = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentYear, setCurrentYear] = useState(years[0]);
  const [lightboxImage, setLightboxImage] = useState<NoteImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  // Convert vertical wheel to horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // If mostly horizontal scroll (trackpad), let it through
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Track scroll to update year
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const containerRect = el.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;

      // Find the image element closest to center
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
  }, []);

  // Drag to scroll
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    dragState.current = {
      isDown: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
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

  // Jump to year
  const jumpToYear = useCallback((year: string) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = el.querySelector<HTMLElement>(`[data-year="${year}"]`);
    if (target) {
      el.scrollTo({
        left: target.offsetLeft - 100,
        behavior: "smooth",
      });
    }
  }, []);

  const handleImageClick = useCallback(
    (img: NoteImage) => {
      if (dragState.current.moved) return;
      setLightboxImage(img);
    },
    []
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Header showName />

      {/* Horizontal scroll container */}
      <div
        ref={scrollRef}
        className="h-full w-full overflow-x-auto overflow-y-hidden flex items-center justify-start"
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
      >
        {/* Leading spacer */}
        <div className="shrink-0 w-[15vw]" />

        {/* Images */}
        {notesImages.map((img, i) => (
            <div
              key={img.id}
              data-year={img.year}
              className="shrink-0 px-3 md:px-5 flex items-center justify-center"
            >
              <img
                src={img.src}
                alt={`Notes — ${img.year}`}
                draggable={false}
                loading={i < 5 ? "eager" : "lazy"}
                onClick={() => handleImageClick(img)}
                className="w-auto object-contain select-none transition-opacity duration-500"
                style={{
                  maxHeight: "85vh",
                  maxWidth: "90vw",
                  cursor: isDragging ? "grabbing" : "pointer",
                }}
              />
            </div>
        ))}

        {/* Trailing spacer */}
        <div className="shrink-0 w-[30vw]" />
      </div>

      {/* Year indicator — fixed bottom-left */}
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

      {/* Year jump dots — fixed bottom-right */}
      <div className="fixed bottom-8 right-6 md:right-10 z-30 flex gap-4 items-center">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => jumpToYear(year)}
            className={`font-sans text-[10px] tracking-[0.15em] uppercase transition-opacity duration-300 ${
              currentYear === year
                ? "text-foreground opacity-100"
                : "text-foreground opacity-30 hover:opacity-60"
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center cursor-pointer"
            onClick={() => setLightboxImage(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-[90vw] max-h-[85vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={lightboxImage.srcLarge}
                alt={`Notes — ${lightboxImage.year}`}
                className="max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain"
              />
              <span className="mt-4 font-serif text-sm text-muted-foreground italic">
                {lightboxImage.year}
              </span>
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setLightboxImage(null)}
              className="fixed top-6 right-6 md:right-10 z-50 nav-link"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hide scrollbar */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Notes;
