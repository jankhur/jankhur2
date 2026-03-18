import { useRef, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import SketchCursor from "@/components/SketchCursor";
import { arildImages } from "@/data/editorialData";

const EditorialArild = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

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

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Header showName />
      <SketchCursor type="editorial" />

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
        onClick={handleClick}
      >
        <div className="shrink-0 w-[15vw]" />

        {arildImages.map((img, i) => (
          <div key={img.id} className="shrink-0 px-3 md:px-5 flex items-center justify-center">
            <img
              src={img.src}
              alt={`Arild Eriksen — ${i + 1}`}
              draggable={false}
              loading={i < 5 ? "eager" : "lazy"}
              className="w-auto object-contain select-none transition-opacity duration-500"
              style={{ maxHeight: "75vh", maxWidth: "90vw", cursor: isDragging ? "grabbing" : "default" }}
            />
          </div>
        ))}

        <div className="shrink-0 w-[30vw]" />
      </div>

      <div className="fixed bottom-12 left-6 md:left-10 z-30 pointer-events-none">
        <span className="font-serif text-sm text-foreground">
          <span className="font-bold">Arild Eriksen</span>
          <span className="font-normal text-muted-foreground">, Obos</span>
        </span>
      </div>

      {/* Scroll hint arrow — mobile only, fades out after scrolling */}
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

export default EditorialArild;
