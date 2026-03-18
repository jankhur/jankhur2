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
  <svg width="72" height="58" viewBox="0 0 72 58" fill="none" className="text-foreground">
    {/* Camera body — crude wobbly box */}
    <path
      d="M8 18 C6 17, 5 15, 8 14 L56 11 C60 10, 63 13, 62 17 L60 42 C59 46, 56 48, 52 47 L14 49 C10 49, 7 46, 8 42 Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      strokeDasharray="3 1"
    />
    {/* Lens — messy double circle */}
    <path
      d="M35 23 C41 21, 47 25, 46 31 C45 37, 40 40, 34 39 C28 39, 24 35, 25 30 C25 25, 29 22, 35 23"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M35 27 C38 26, 40 28, 40 31 C39 33, 37 35, 35 34 C32 34, 30 32, 31 30 C31 28, 33 27, 35 27"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Viewfinder — crude bump */}
    <path
      d="M26 14 L24 5 C23 3, 26 1, 28 2 L42 2 C44 1, 46 3, 45 5 L43 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Shutter button — wobbly dot */}
    <path
      d="M52 6 C54 5, 56 6, 55 8 C55 10, 53 11, 51 9 C50 8, 51 6, 52 6"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
    {/* Strap loop left */}
    <path d="M8 20 C3 19, 2 22, 5 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    {/* Strap loop right */}
    <path d="M62 18 C67 17, 68 21, 65 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
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
