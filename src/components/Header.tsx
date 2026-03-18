import { useState, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Editorial", href: "/editorial" },
  { label: "Commercial", href: "https://abrakadabra.studio/", external: true },
  { label: "Journey", href: "/journey" },
  { label: "Notes", href: "/notes" },
  { label: "About", href: "/about" },
];

interface HeaderProps {
  showName?: boolean;
}

// Editorial — hand-drawn magazine
const SketchMagazine = () => (
  <svg width="56" height="68" viewBox="0 0 56 68" fill="none" className="text-foreground">
    {/* Magazine cover */}
    <path d="M6 4 L48 2 C50 2, 52 4, 51 6 L49 62 C49 64, 47 66, 45 66 L8 67 C5 67, 4 65, 4 63 Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Spine fold */}
    <path d="M6 4 L8 67" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 2" />
    {/* Title lines */}
    <path d="M16 14 L40 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 20 L35 19" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    {/* Photo placeholder */}
    <path d="M14 28 L42 27 L41 50 L13 51 Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Mountain in photo */}
    <path d="M16 47 L22 35 L28 42 L33 32 L39 47" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
    {/* Bottom text */}
    <path d="M14 57 L38 56" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M14 61 L30 60" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
  </svg>
);

// Commercial — hand-drawn money
const SketchMoney = () => (
  <svg width="72" height="48" viewBox="0 0 72 48" fill="none" className="text-foreground">
    {/* Bill shape */}
    <path d="M4 8 L66 5 C69 5, 71 7, 70 10 L67 40 C67 43, 64 44, 62 44 L6 46 C3 46, 1 43, 2 41 Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Inner border */}
    <path d="M10 12 L62 10 L60 38 L9 40 Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="3 2" fill="none" />
    {/* Dollar sign */}
    <path d="M36 15 L36 36" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M42 18 C42 16, 39 14, 36 15 C32 16, 31 19, 34 21 C37 23, 40 24, 40 27 C40 30, 37 32, 33 31 C30 30, 29 28, 30 26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Corner circles */}
    <circle cx="14" cy="14" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
    <circle cx="58" cy="12" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
    {/* Sparkle */}
    <path d="M54 30 L56 26 L58 30 L62 28 L58 32 L56 36 L54 32 L50 30 Z" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
  </svg>
);

// Journey — hand-drawn train tracks
const SketchTracks = () => (
  <svg width="72" height="56" viewBox="0 0 72 56" fill="none" className="text-foreground">
    {/* Left rail */}
    <path d="M8 52 C12 40, 18 28, 26 20 C34 12, 42 8, 52 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Right rail */}
    <path d="M18 54 C22 42, 27 30, 34 22 C41 14, 48 10, 58 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Sleepers / ties */}
    <path d="M6 50 L20 52" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 42 L25 44" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M18 34 L30 36" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M24 26 L35 28" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M31 20 L41 21" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    <path d="M38 14 L47 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M46 9 L53 10" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    {/* Sun */}
    <circle cx="62" cy="14" r="5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    <path d="M62 6 L62 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M68 10 L71 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M56 10 L53 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

// Notes — hand-drawn diary
const SketchDiary = () => (
  <svg width="52" height="64" viewBox="0 0 52 64" fill="none" className="text-foreground">
    {/* Book cover */}
    <path d="M8 3 L44 2 C46 2, 48 4, 47 6 L46 58 C46 61, 44 62, 42 62 L10 63 C7 63, 5 61, 6 58 Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Spine */}
    <path d="M12 3 L13 63" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    {/* Elastic band */}
    <path d="M30 2 L29 62" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeDasharray="6 3" />
    {/* Writing lines */}
    <path d="M18 16 L40 15" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M18 22 L38 21" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M18 28 L42 27" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M18 34 L36 33" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    <path d="M18 40 L40 39" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    {/* Little heart or star doodle */}
    <path d="M35 48 C36 45, 40 45, 40 48 C40 51, 37 53, 35 55 C33 53, 30 51, 30 48 C30 45, 34 45, 35 48" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
  </svg>
);

// About — hand-drawn face sketch
const SketchFace = () => (
  <svg width="56" height="68" viewBox="0 0 56 68" fill="none" className="text-foreground">
    {/* Head shape */}
    <path d="M28 6 C38 5, 48 12, 48 24 L47 38 C46 48, 40 56, 28 58 C16 56, 10 48, 9 38 L8 24 C8 12, 18 5, 28 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" />
    {/* Hair — messy lines */}
    <path d="M12 18 C14 8, 22 3, 28 4 C34 3, 42 8, 44 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M10 20 C8 12, 14 5, 20 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
    <path d="M46 20 C48 12, 42 5, 36 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
    {/* Eyes — simple dots with brows */}
    <circle cx="20" cy="28" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <circle cx="36" cy="28" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M16 24 C18 22, 22 22, 24 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
    <path d="M32 24 C34 22, 38 22, 40 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="none" />
    {/* Nose */}
    <path d="M28 30 C26 34, 24 37, 26 38 C28 39, 30 39, 32 38" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    {/* Mouth — slight smile */}
    <path d="M22 44 C24 47, 32 47, 34 44" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    {/* Ears */}
    <path d="M8 24 C5 26, 4 32, 7 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    <path d="M48 24 C51 26, 52 32, 49 34" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    {/* Neck hint */}
    <path d="M22 58 L24 66" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    <path d="M34 58 L32 66" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

const menuIllustrations = [SketchMagazine, SketchMoney, SketchTracks, SketchDiary, SketchFace];

const FlashBurst = () => (
  <motion.svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    className="absolute -top-5 -right-3 text-foreground"
    initial={{ scale: 0, opacity: 0 }}
    animate={{
      scale: [0, 1.3, 0],
      opacity: [0, 0.9, 0],
    }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    <line x1="20" y1="2" x2="20" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="20" y1="30" x2="20" y2="38" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="2" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="30" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="7" y1="7" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="27" y1="7" x2="33" y2="13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="7" y1="33" x2="13" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="27" y1="33" x2="33" y2="27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </motion.svg>
);

const Header = ({ showName = false }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [flashKey, setFlashKey] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const handleHover = useCallback((index: number) => {
    if (hoveredIndex !== index) {
      setFlashKey((k) => k + 1);
    }
    setHoveredIndex(index);
  }, [hoveredIndex]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-background">
        <Link to="/" className="relative h-6 flex items-center">
          <AnimatePresence mode="wait">
            {showName && (
              <motion.span
                key="name"
                initial={{ opacity: 0, y: 20, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.8 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-sm font-bold tracking-[0.2em] text-foreground uppercase"
              >
                JAN KHÜR
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex flex-col gap-[5px] z-50 relative"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
            className="block w-7 h-[2px] bg-foreground"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="block w-7 h-[2px] bg-foreground"
            transition={{ duration: 0.2 }}
          />
          <motion.span
            animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
            className="block w-7 h-[2px] bg-foreground"
            transition={{ duration: 0.3 }}
          />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-background flex items-center justify-center"
          >
            <div className="relative">
              <ul ref={listRef} className="flex flex-col items-center gap-8">
                {navItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    onMouseEnter={() => handleHover(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMenuOpen(false)}
                        className="font-serif text-4xl md:text-5xl text-foreground"
                      >
                        <motion.span
                          className="inline-block"
                          whileHover={{
                            scaleY: 1.3,
                            y: 8,
                            filter: "blur(2px)",
                            opacity: 0.6,
                            transition: { duration: 0.6, ease: "easeOut" }
                          }}
                        >
                          {item.label}
                        </motion.span>
                      </a>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setMenuOpen(false)}
                        className="font-serif text-4xl md:text-5xl text-foreground"
                      >
                        <motion.span
                          className="inline-block"
                          whileHover={{
                            scaleY: 1.3,
                            y: 8,
                            filter: "blur(2px)",
                            opacity: 0.6,
                            transition: { duration: 0.6, ease: "easeOut" }
                          }}
                        >
                          {item.label}
                        </motion.span>
                      </Link>
                    )}
                  </motion.li>
                ))}
              </ul>

              {/* Floating hand-drawn camera */}
              <AnimatePresence>
                {hoveredIndex !== null && (
                  <motion.div
                    key={`camera-${hoveredIndex}`}
                    className="absolute pointer-events-none hidden md:block"
                    initial={{ opacity: 0, scale: 0.5, rotate: -25 }}
                    animate={{
                      opacity: 1,
                      scale: [0.5, 1.15, 0.9, 1.05, 1],
                      rotate: [-20, 14, -10, 6, -2, 0],
                      x: hoveredIndex % 2 === 0 ? 200 : -250,
                      y: hoveredIndex * 72 - 15,
                    }}
                    exit={{ opacity: 0, scale: 0.4, rotate: 20 }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 10,
                      mass: 0.8,
                      rotate: { duration: 0.8, ease: "easeInOut" },
                      scale: { duration: 0.6, ease: "easeOut" },
                    }}
                    style={{ top: 0, left: "50%" }}
                  >
                    {(() => {
                      const Illustration = menuIllustrations[hoveredIndex!];
                      return <Illustration />;
                    })()}
                    <AnimatePresence mode="wait">
                      <FlashBurst key={flashKey} />
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
