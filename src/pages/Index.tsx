import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import ImageFeed from "@/components/ImageFeed";
import SketchCursor from "@/components/SketchCursor";
import { DEFAULT_LOGO, useLogoSettings } from "@/lib/siteSettings";

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
  const { data: logo = DEFAULT_LOGO } = useLogoSettings();
  const tuningRef = useRef(tuning);
  useEffect(() => {
    tuningRef.current = tuning;
    localStorage.setItem(TUNING_KEY, JSON.stringify(tuning));
  }, [tuning]);

  // Native CSS scroll snap: the browser handles trackpad physics, so one flick
  // settles on the next photo with no stutter; scrolling up stays natural.
  useEffect(() => {
    const HEADER = 96;
    const BOTTOM_ROOM = 48;
    const html = document.documentElement;
    const prevSnap = html.style.scrollSnapType;
    html.style.scrollSnapType = "y mandatory";

    const apply = () => {
      const lift = tuningRef.current.lift;
      document.querySelectorAll<HTMLElement>("[data-feed-item]").forEach((el) => {
        el.style.scrollSnapAlign = "center";
        el.style.scrollSnapStop = "normal";
        el.style.scrollMarginTop = `${HEADER - lift}px`;
        el.style.scrollMarginBottom = `${BOTTOM_ROOM + lift}px`;
      });
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(document.body, { childList: true, subtree: true });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      const items = Array.from(document.querySelectorAll<HTMLElement>("[data-feed-item]"));
      const mid = HEADER + (window.innerHeight - HEADER - BOTTOM_ROOM) / 2;
      const centers = items.map((el) => { const r = el.getBoundingClientRect(); return r.top + r.height / 2 - mid; });
      let cur = 0;
      centers.forEach((c, i) => { if (Math.abs(c) < Math.abs(centers[cur])) cur = i; });
      const next = items[Math.max(0, Math.min(items.length - 1, cur + (e.key === "ArrowRight" ? 1 : -1)))];
      next?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      mo.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      html.style.scrollSnapType = prevSnap;
    };
  }, [tuning.lift]);

  return (
    <div className="min-h-screen bg-background">
      <Header showName />
      <SketchCursor type="lov" />

      {/* Image Feed */}
      <main className="pt-24 pb-32">
        <ImageFeed />
      </main>

      {/* Optional scroll tuning panel */}
      {logo.showScrollControls && <div data-tuning-panel className="fixed bottom-4 left-4 z-[60] font-serif text-xs text-foreground">
        {panelOpen ? (
          <div className="w-64 space-y-3 border border-border bg-background p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-[0.15em]">Scroll tuning</span>
              <button onClick={() => setPanelOpen(false)} aria-label="Close tuning">✕</button>
            </div>
            {([
              ["lift", "Photo position (lower ← → higher)", -80, 100, 1, "px"],
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
      </div>}

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