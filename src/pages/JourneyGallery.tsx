import { useRef, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import { japanImages, southAfricaImages, type JourneyImage } from "@/data/journeyData";

const galleryMap: Record<string, { images: JourneyImage[]; title: string }> = {
  japan: { images: japanImages, title: "Japan" },
  "south-africa": { images: southAfricaImages, title: "South Africa" },
};

const JourneyGallery = () => {
  const { slug } = useParams<{ slug: string }>();
  const gallery = galleryMap[slug || ""];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [lightboxImage, setLightboxImage] = useState<JourneyImage | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

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

  const handleImageClick = useCallback((img: JourneyImage) => {
    if (dragState.current.moved) return;
    setLightboxImage(img);
  }, []);

  if (!gallery) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Header showName />
        <p className="text-foreground">Gallery not found</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <Header showName />

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
        <div className="shrink-0 w-[15vw]" />

        {gallery.images.map((img, i) => (
          <div key={img.id} className="shrink-0 px-3 md:px-5 flex items-center justify-center">
            <img
              src={img.src}
              alt={`${gallery.title} — ${i + 1}`}
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

        <div className="shrink-0 w-[30vw]" />
      </div>

      <div className="fixed bottom-8 left-6 md:left-10 z-30 pointer-events-none">
        <span className="font-serif text-sm text-foreground">
          <span className="font-bold">{gallery.title}</span>
        </span>
      </div>

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
                alt={gallery.title}
                className="max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain"
              />
            </motion.div>

            <button
              onClick={() => setLightboxImage(null)}
              className="fixed top-6 right-6 md:right-10 z-50 nav-link"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default JourneyGallery;
