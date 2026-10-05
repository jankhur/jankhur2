import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Header from "@/components/Header";
import ImageFeed from "@/components/ImageFeed";
import SketchCursor from "@/components/SketchCursor";

type Tuning = { lift: number; threshold: number; duration: number };
const DEFAULT_TUNING: Tuning = { lift: 0, threshold: 80, duration: 0.7 };
const TUNING_KEY = "landing-scroll-tuning-v2";

const loadTuning = (): Tuning => {
  try {
    return { ...DEFAULT_TUNING, ...JSON.parse(localStorage.getItem(TUNING_KEY) || "{}") };
  } catch {
    return DEFAULT_TUNING;
  }
};

const Index = () => {
  const [tuning, setTuning] = useState<Tuning>(loadTuning);
  const [panelOpen, setPanelOpen] = useState(false);
  const tuningRef = useRef(tuning);
  useEffect(() => {
    tuningRef.current = tuning;
    localStorage.setItem(TUNING_KEY, JSON.stringify(tuning));
  }, [tuning]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;
    let frame = 0;
    const HEADER = 96;
    const BOTTOM_ROOM = 48;
    let idleTimer = 0;
    let snapping = false;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const targetFor = (el: Element) => {
      const r = el.getBoundingClientRect();
      const area = window.innerHeight - HEADER - BOTTOM_ROOM;
      const offset = r.height <= area ? HEADER + (area - r.height) / 2 : HEADER;
      return Math.max(0, window.scrollY + r.top - offset + tuningRef.current.lift);
    };

    // Soft proximity snap: only settle a photo that is already almost fully in view.
    const trySnap = () => {
      if (!lenis || snapping) return;
      const vh = window.innerHeight;
      const need = tuningRef.current.threshold / 100;
      let best: { target: number; frac: number } | null = null;
      for (const el of Array.from(document.querySelectorAll("[data-feed-item]"))) {
        const r = el.getBoundingClientRect();
        if (r.height === 0) continue;
        const visible = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
        const frac = visible / Math.min(r.height, vh);
        if (frac >= need && (!best || frac > best.frac)) best = { target: targetFor(el), frac };
      }
      if (!best || Math.abs(best.target - window.scrollY) < 3) return;
      snapping = true;
      lenis.scrollTo(best.target, {
        duration: tuningRef.current.duration,
        easing: ease,
        onComplete: () => { snapping = false; },
      });
    };

    const onScroll = () => {
      clearTimeout(idleTimer);
      if (snapping) return;
      idleTimer = window.setTimeout(trySnap, 220);
    };
    const onWheel = () => { snapping = false; };

    const start = () => {
      if (reducedMotion.matches || lenis) return;
      lenis = new Lenis({ smoothWheel: true, syncTouch: false, lerp: 0.09 });
      lenis.on("scroll", onScroll);
      window.addEventListener("wheel", onWheel, { passive: true });
      const animate = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
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

      {/* Temporary scroll tuning panel */}
      <div data-tuning-panel className="fixed bottom-4 left-4 z-[60] font-serif text-xs text-foreground">
        {panelOpen ? (
          <div className="w-64 space-y-3 border border-border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-[0.15em]">Scroll tuning</span>
              <button onClick={() => setPanelOpen(false)} aria-label="Close tuning">✕</button>
            </div>
            {([
              ["lift", "Photo position (lower ← → higher)", -80, 100, 1, "px"],
              ["threshold", "Snap only when photo is this visible", 50, 100, 1, "%"],
              ["duration", "Glide speed (fast ← → slow)", 0.3, 1.8, 0.05, "s"],
            ] as const).map(([key, label, min, max, step, unit]) => (
              <label key={key} className="block space-y-1">
                <span className="flex justify-between"><span>{label}</span><span>{tuning[key]}{unit}</span></span>
                <input
                  type="range" min={min} max={max} step={step} value={tuning[key]}
                  onChange={(e) => setTuning((t) => ({ ...t, [key]: Number(e.target.value) }))}
                  className="w-full accent-foreground"
                />
              </label>
            ))}
            <button onClick={() => setTuning(DEFAULT_TUNING)} className="underline">Reset</button>
          </div>
        ) : (
          <button onClick={() => setPanelOpen(true)} className="border border-border bg-background px-3 py-1.5 uppercase tracking-[0.15em]">
            Tune scroll
          </button>
        )}
      </div>

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