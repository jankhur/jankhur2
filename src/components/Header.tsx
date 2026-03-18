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

const HandDrawnCamera = () => (
  <svg width="64" height="52" viewBox="0 0 64 52" fill="none" className="text-foreground">
    {/* Camera body — sketchy rectangle */}
    <path
      d="M6 16 C5 15, 7 13, 10 13 L54 12 C57 12, 59 14, 58 16 L57 40 C57 43, 55 44, 52 44 L12 45 C9 45, 7 43, 7 40 Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Lens — wobbly circle */}
    <path
      d="M32 22 C37 21, 42 24, 41 29 C41 34, 37 37, 32 37 C27 37, 23 34, 23 29 C23 24, 27 22, 32 22"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      fill="none"
    />
    {/* Inner lens */}
    <circle cx="32" cy="29" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
    {/* Viewfinder bump */}
    <path
      d="M24 13 L22 6 C22 4, 24 3, 26 3 L38 3 C40 3, 42 4, 42 6 L40 13"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Shutter button */}
    <circle cx="48" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

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
    {/* Star burst lines */}
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
                    initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: [0, -8, 5, -3, 0],
                      x: hoveredIndex % 2 === 0 ? 120 : -140,
                      y: hoveredIndex * 72 - 10,
                    }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 15 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                      rotate: { duration: 0.6, ease: "easeInOut" },
                    }}
                    style={{ top: 0, left: "50%" }}
                  >
                    <HandDrawnCamera />
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
