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

      {/* Hero: Name + Bio side by side */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="pt-24 pb-12 md:pt-28 md:pb-16 px-6 md:px-10"
      >
        <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-16">
          <h1 className="font-sans font-bold text-foreground text-[13vw] md:text-[10vw] leading-[1.05] tracking-tight uppercase">
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

          {/* Bio & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="md:pb-[1.5vw] md:max-w-xs lg:max-w-sm shrink-0"
          >
            <p className="font-serif text-base md:text-lg leading-relaxed text-foreground mb-6">
              Oslo-based photographer working between editorial,
              commercial and independent works. With a focus on portraiture,
              documentary and analogue processes.
            </p>
            <div>
              <h2 className="nav-link mb-3">Contact</h2>
              <div className="space-y-1">
                <a
                  href="https://www.instagram.com/jankhur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center gap-2"
                >
                  Instagram <span aria-hidden>→</span>
                </a>
                <a
                  href="mailto:jankhur@gmail.com"
                  className="nav-link flex items-center gap-2"
                >
                  Email <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
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
