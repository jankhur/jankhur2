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
    const HEADER = 96;
    const BOTTOM_ROOM = 48; // extra breathing space under captions
    const LIFT = 45; // shift the resting frame up so captions clear the bottom
    const PAGE_THRESHOLD = 40; // px of wheel travel before flipping to the next photo
    const FREE_THRESHOLD = 900; // total travel in one gesture that switches to free glide
    let accumulated = 0;
    let gestureTotal = 0;
    let locked = false;
    let free = false;
    let freeTarget = 0;
    let gestureTimer = 0;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    // Scroll position that frames an item fully below the header.
    const targetFor = (el: Element) => {
      const r = el.getBoundingClientRect();
      const area = window.innerHeight - HEADER - BOTTOM_ROOM;
      const offset = r.height <= area ? HEADER + (area - r.height) / 2 : HEADER;
      return Math.max(0, window.scrollY + r.top - offset + LIFT);
    };
    const allTargets = () => Array.from(document.querySelectorAll("[data-feed-item]")).map(targetFor);
    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const onWheel = (e: WheelEvent) => {
      if (!lenis || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      clearTimeout(gestureTimer);
      // A gesture ends after a short pause; trackpad inertia stays in the same gesture.
      gestureTimer = window.setTimeout(() => {
        if (free) {
          // Glide finished: settle on the nearest photo.
          const y = window.scrollY;
          const t = allTargets();
          const nearest = t.length ? t.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a)) : y;
          lenis?.scrollTo(nearest, { duration: 0.7, easing: ease });
        } else if (!locked && accumulated !== 0) {
          lenis?.scrollTo(window.scrollY + accumulated, { duration: 0.4 });
        }
        accumulated = 0;
        gestureTotal = 0;
        locked = false;
        free = false;
      }, 160);

      gestureTotal += Math.abs(e.deltaY);
      if (!free && gestureTotal > FREE_THRESHOLD) {
        free = true;
        freeTarget = window.scrollY;
      }
      if (free) {
        freeTarget = Math.min(maxScroll(), Math.max(0, freeTarget + e.deltaY * 1.2));
        lenis.scrollTo(freeTarget, { duration: 0.5, easing: ease });
        return;
      }

      if (locked) return;
      accumulated += e.deltaY;
      if (Math.abs(accumulated) < PAGE_THRESHOLD) return;

      const dir = Math.sign(accumulated);
      locked = true;
      accumulated = 0;
      const targets = allTargets();
      const y = window.scrollY;
      let next: number | undefined;
      if (dir > 0) next = targets.find((t) => t > y + 4) ?? maxScroll();
      else next = [...targets].reverse().find((t) => t < y - 4) ?? 0;
      lenis.scrollTo(next, { duration: 0.9, easing: ease });
    };

    const start = () => {
      if (reducedMotion.matches || lenis) return;
      lenis = new Lenis({ smoothWheel: true, syncTouch: false, virtualScroll: (data) => !(data.event instanceof WheelEvent) });
      window.addEventListener("wheel", onWheel, { passive: false });
      const animate = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      clearTimeout(gestureTimer);
      window.removeEventListener("wheel", onWheel);
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