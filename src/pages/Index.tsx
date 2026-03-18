import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ImageFeed from "@/components/ImageFeed";

const nameLetters = [
  { char: "J", line: 0 },
  { char: "A", line: 0 },
  { char: "N", line: 0 },
  { char: "K", line: 1 },
  { char: "H", line: 1 },
  { char: "Ü", line: 1 },
  { char: "R", line: 1 },
];

const Index = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header showName={scrolled} />

      {/* Hero: Large name */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="pt-28 pb-20 md:pt-36 md:pb-32 px-6 md:px-10"
      >
        <h1 className="font-sans font-bold text-foreground text-[15vw] md:text-[12vw] leading-[1.1] tracking-tight uppercase">
          <span className="inline-flex">
            {nameLetters.filter(l => l.line === 0).map((l, i) => (
              <motion.span
                key={`line0-${i}`}
                className="inline-block"
                animate={{ y: [0, -8, 0, 6, 0] }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.12,
                  repeat: 7,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                {l.char}
              </motion.span>
            ))}
          </span>
          <br />
          <span className="inline-flex">
            {nameLetters.filter(l => l.line === 1).map((l, i) => (
              <motion.span
                key={`line1-${i}`}
                className="inline-block"
                animate={{ y: [0, -8, 0, 6, 0] }}
                transition={{
                  duration: 0.6,
                  delay: (i + 3) * 0.12,
                  repeat: 7,
                  repeatType: "loop",
                  ease: "easeInOut",
                }}
              >
                {l.char}
              </motion.span>
            ))}
          </span>
        </h1>
      </motion.div>

      {/* Image Feed */}
      <main className="pb-32">
        <ImageFeed />
      </main>

      {/* Minimal Footer */}
      <footer className="px-6 md:px-10 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="nav-link">© 2025 Jan Khür</span>
          <div className="flex gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="nav-link">
              Instagram
            </a>
            <a href="mailto:hello@jankhur.com" className="nav-link">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;