import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ImageFeed from "@/components/ImageFeed";
import SketchCursor from "@/components/SketchCursor";

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
      <SketchCursor type="lov" />

      {/* Hero: Contact links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        className="pt-24 pb-12 md:pt-28 md:pb-16 px-6 md:px-10">
        
        <div className="max-w-[90vw] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}>
            
            <div className="flex gap-4">
              <motion.a
                href="https://www.instagram.com/jankhur"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link inline-block"
                whileHover={{ 
                  rotate: [0, -10, 12, -8, 5, 0],
                  scale: 1.15,
                  transition: { duration: 0.5 }
                }}
                whileTap={{ scale: 0.8, rotate: 360 }}
              >
                Instagram
              </motion.a>
              <motion.a
                href="mailto:jan@abrakadabra.studio"
                className="nav-link inline-block"
                whileHover={{
                  y: [0, -6, 0, -4, 0, -2, 0],
                  transition: { duration: 0.6, repeat: Infinity }
                }}
                whileTap={{ scale: 1.4, transition: { type: "spring", stiffness: 500 } }}
              >
                Email
              </motion.a>
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
          <span className="font-serif text-sm text-muted-foreground">© 2025 Jan Khür</span>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/jankhur" target="_blank" rel="noopener noreferrer" className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </a>
            <a href="mailto:jan@abrakadabra.studio" className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
