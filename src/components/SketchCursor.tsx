import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Editorial — magazine
const SketchMagazine = () => (
  <svg width="32" height="38" viewBox="0 0 56 68" fill="none" className="text-foreground">
    <path d="M6 4 L48 2 C50 2, 52 4, 51 6 L49 62 C49 64, 47 66, 45 66 L8 67 C5 67, 4 65, 4 63 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M6 4 L8 67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 2" />
    <path d="M16 14 L40 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M16 20 L35 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 28 L42 27 L41 50 L13 51 Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M16 47 L22 35 L28 42 L33 32 L39 47" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M14 57 L38 56" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Commercial — money
const SketchMoney = () => (
  <svg width="40" height="28" viewBox="0 0 72 48" fill="none" className="text-foreground">
    <path d="M4 8 L66 5 C69 5, 71 7, 70 10 L67 40 C67 43, 64 44, 62 44 L6 46 C3 46, 1 43, 2 41 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M36 15 L36 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M42 18 C42 16, 39 14, 36 15 C32 16, 31 19, 34 21 C37 23, 40 24, 40 27 C40 30, 37 32, 33 31 C30 30, 29 28, 30 26" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="58" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

// Journey — train tracks
const SketchTracks = () => (
  <svg width="36" height="32" viewBox="0 0 72 56" fill="none" className="text-foreground">
    <path d="M8 52 C12 40, 18 28, 26 20 C34 12, 42 8, 52 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M18 54 C22 42, 27 30, 34 22 C41 14, 48 10, 58 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M6 50 L20 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 42 L25 44" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 34 L30 36" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M24 26 L35 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M31 20 L41 21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M38 14 L47 15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="62" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

// Notes — diary
const SketchDiary = () => (
  <svg width="30" height="36" viewBox="0 0 52 64" fill="none" className="text-foreground">
    <path d="M8 3 L44 2 C46 2, 48 4, 47 6 L46 58 C46 61, 44 62, 42 62 L10 63 C7 63, 5 61, 6 58 Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M12 3 L13 63" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M30 2 L29 62" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="6 3" />
    <path d="M18 16 L40 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 22 L38 21" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M18 28 L42 27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M18 34 L36 33" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M18 40 L40 39" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M35 48 C36 45, 40 45, 40 48 C40 51, 37 53, 35 55 C33 53, 30 51, 30 48 C30 45, 34 45, 35 48" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
  </svg>
);

// About — face
const SketchFace = () => (
  <svg width="32" height="38" viewBox="0 0 56 68" fill="none" className="text-foreground">
    <path d="M28 6 C38 5, 48 12, 48 24 L47 38 C46 48, 40 56, 28 58 C16 56, 10 48, 9 38 L8 24 C8 12, 18 5, 28 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M12 18 C14 8, 22 3, 28 4 C34 3, 42 8, 44 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M10 20 C8 12, 14 5, 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M46 20 C48 12, 42 5, 36 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <circle cx="20" cy="28" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <circle cx="36" cy="28" r="2" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M16 24 C18 22, 22 22, 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M32 24 C34 22, 38 22, 40 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M28 30 C26 34, 24 37, 26 38 C28 39, 30 39, 32 38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M22 44 C24 47, 32 47, 34 44" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M8 24 C5 26, 4 32, 7 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M48 24 C51 26, 52 32, 49 34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// Landing — hand-drawn heart
const SketchHeart = () => (
  <svg width="32" height="30" viewBox="0 0 48 44" fill="none" className="text-foreground">
    <path
      d="M24 40 C20 36, 4 26, 4 14 C4 8, 8 3, 14 3 C18 3, 22 6, 24 10 C26 6, 30 3, 34 3 C40 3, 44 8, 44 14 C44 26, 28 36, 24 40 Z"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Highlight line */}
    <path d="M14 10 C12 12, 10 16, 11 20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
  </svg>
);

const illustrationMap: Record<string, React.FC> = {
  editorial: SketchMagazine,
  commercial: SketchMoney,
  journey: SketchTracks,
  notes: SketchDiary,
  about: SketchFace,
  heart: SketchHeart,
};

interface SketchCursorProps {
  type: keyof typeof illustrationMap;
}

const SketchCursor = ({ type }: SketchCursorProps) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only on desktop
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, [visible]);

  const Illustration = illustrationMap[type];
  if (!Illustration) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed pointer-events-none z-[100] hidden md:block"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: 0.6,
            scale: 1,
            x: pos.x + 16,
            y: pos.y + 16,
          }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{
            x: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
            y: { type: "spring", stiffness: 300, damping: 25, mass: 0.5 },
            opacity: { duration: 0.3 },
            scale: { duration: 0.2 },
          }}
          style={{ top: 0, left: 0 }}
        >
          <motion.div
            animate={{ rotate: [0, -3, 2, -1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Illustration />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SketchCursor;
