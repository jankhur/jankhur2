import { motion } from "framer-motion";
import { useEffect } from "react";
import Lenis from "lenis";
import Header from "@/components/Header";
import ImageFeed from "@/components/ImageFeed";
import SketchCursor from "@/components/SketchCursor";

const Index = () => {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let frame = 0;

    const start = () => {
      if (reducedMotion.matches || lenis) return;
      lenis = new Lenis({ duration: 1.1, wheelMultiplier: 0.85, smoothWheel: true, syncTouch: false });
      const animate = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
    };

    const onMotionChange = () => {
      if (reducedMotion.matches) stop();
      else start();
    };

    start();
    reducedMotion.addEventListener("change", onMotionChange);
    return () => {
      reducedMotion.removeEventListener("change", onMotionChange);
      stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header showName />
      <SketchCursor type="lov" />

      {/* Image Feed */}
      <main className="pt-24 pb-32">
        <ImageFeed />
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-12 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <span className="font-serif text-sm text-muted-foreground">© 2026 Jan Khür</span>
          <div className="flex gap-4">
            <motion.a
              href="https://www.instagram.com/jankhur"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link inline-block font-serif text-sm"
              whileHover={{
                rotate: [0, -10, 12, -8, 5, 0],
                scale: 1.15,
                transition: { duration: 0.5 }
              }}
              whileTap={{ scale: 0.8, rotate: 360 }}>
              
              Instagram
            </motion.a>
            <motion.a
              href="mailto:jan@abrakadabra.studio"
              className="nav-link inline-block font-serif text-sm"
              whileHover={{
                y: [0, -6, 0, -4, 0, -2, 0],
                transition: { duration: 0.6, repeat: Infinity }
              }}
              whileTap={{ scale: 1.4, transition: { type: "spring", stiffness: 500 } }}>
              
              Email
            </motion.a>
          </div>
        </div>
      </footer>
    </div>);

};

export default Index;