import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import Header from "@/components/Header";
import ImageFeed from "@/components/ImageFeed";
import SketchCursor from "@/components/SketchCursor";

type Tuning = { lift: number; threshold: number; duration: number };
const DEFAULT_TUNING: Tuning = { lift: 0, threshold: 40, duration: 0.8 };
const TUNING_KEY = "landing-scroll-tuning-v3";

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

    void trySnap;
    // Top settle: after scrolling up near the top, rest at the very top.
    const onScroll = () => {
      clearTimeout(idleTimer);
      if (snapping || freeUntil > performance.now()) return;
      idleTimer = window.setTimeout(() => {
        if (!lenis || snapping || lastDir !== -1) return;
        const y = window.scrollY;
        if (y > 0 && y < 160) lenis.scrollTo(0, { duration: tuningRef.current.duration, easing: ease });
      }, 260);
    };

    // One downward flick = glide straight to the next photo, fully framed.
    // A second flick during the glide = free fast scroll. Up = free scroll.
    let lastWheel = 0;
    let glideStart = 0;
    let freeUntil = 0;
    let lastDir: 1 | -1 | 0 = 0;
    const onWheel = (e: WheelEvent) => {
      if (!lenis || e.ctrlKey) return;
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (Math.abs(e.deltaY) < 1) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      lastDir = dir;
      if (dir === -1) { snapping = false; freeUntil = 0; return; } // free scroll up
      if (freeUntil > now) { freeUntil = now + 700; return; } // fast mode: let Lenis scroll
      if (snapping) {
        // Trailing trackpad momentum: swallow. New flick during glide: go free.
        if (gap > 140 && now - glideStart > 120) {
          snapping = false;
          freeUntil = now + 700;
          return;
        }
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (Math.abs(e.deltaY) < tuningRef.current.threshold / 20) return;
      const y = window.scrollY;
      const targets = Array.from(document.querySelectorAll("[data-feed-item]")).map(targetFor);
      const target = targets.find((t) => t > y + 8);
      if (target === undefined) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      snapping = true;
      glideStart = now;
      lenis.scrollTo(target, {
        duration: tuningRef.current.duration,
        easing: ease,
        lock: true,
        onComplete: () => { snapping = false; },
      });
    };

    // Arrow keys: glide to previous / next photograph.
    const stepTo = (dir: 1 | -1) => {
      if (!lenis || snapping) return;
      const items = Array.from(document.querySelectorAll("[data-feed-item]"));
      if (items.length === 0) return;
      const y = window.scrollY;
      const targets = items.map((el) => targetFor(el));
      let idx = targets.findIndex((t) => Math.abs(t - y) < 8);
      if (idx === -1) {
        idx = dir === 1
          ? targets.findIndex((t) => t > y + 8)
          : targets.length - 1 - [...targets].reverse().findIndex((t) => t < y - 8);
      } else {
        idx += dir;
      }
      idx = Math.max(0, Math.min(items.length - 1, idx));
      const target = targets[idx];
      if (Math.abs(target - y) < 3) return;
      snapping = true;
      lenis.scrollTo(target, {
        duration: tuningRef.current.duration,
        easing: ease,
        onComplete: () => { snapping = false; },
      });
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      stepTo(e.key === "ArrowRight" ? 1 : -1);
    };

    const start = () => {
      if (reducedMotion.matches || lenis) return;
      lenis = new Lenis({ smoothWheel: true, syncTouch: false, lerp: 0.09 });
      lenis.on("scroll", onScroll);
      window.addEventListener("wheel", onWheel, { passive: false, capture: true });
      window.addEventListener("keydown", onKeyDown);
      const animate = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("keydown", onKeyDown);
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
              ["threshold", "Flick sensitivity (sensitive ← → firm)", 10, 200, 1, ""],
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