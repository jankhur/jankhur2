import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Editorial", href: "/editorial" },
  { label: "Commercial", href: "/commercial" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Journey", href: "/journey" },
  { label: "Notes", href: "/notes" },
  { label: "About", href: "/about" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-background">
        <Link to="/" className="nav-link text-sm font-normal tracking-[0.2em]">
          JAN KHÜR
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
            <ul className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                >
                  <Link
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-serif text-4xl md:text-5xl text-foreground hover:opacity-50 transition-opacity duration-300"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
