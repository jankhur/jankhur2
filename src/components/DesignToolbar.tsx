import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/adminApi";
import { fontOptions } from "@/lib/siteFonts";
import {
  DEFAULT_LOGO, DEFAULT_SETTING_VALUES, LogoSettings, breadcrumbFontOptions, breadcrumbSeparatorOptions,
  headerModeOptions, logoPlacementOptions, menuButtonStyleOptions, useLogoSettings,
} from "@/lib/siteSettings";

type Fonts = { logo: string; serif: string; bg?: string; fg?: string };

const KEY_MAP: Record<keyof LogoSettings, string> = {
  headerMode: "header_mode", logoText: "logo_text", logoSize: "logo_size", logoSpacing: "logo_spacing",
  logoUppercase: "logo_uppercase", logoPlacement: "logo_placement", menuButtonStyle: "menu_button_style",
  showScrollControls: "show_scroll_controls", customCursor: "custom_cursor", menuAnimations: "menu_animations",
  breadcrumbShow: "breadcrumb_show", breadcrumbSync: "breadcrumb_sync", breadcrumbSize: "breadcrumb_size",
  breadcrumbSpacing: "breadcrumb_spacing", breadcrumbUppercase: "breadcrumb_uppercase",
  breadcrumbFont: "breadcrumb_font", breadcrumbSeparator: "breadcrumb_separator",
};

/** Floating design dock for the signed-in admin: preview locally, then publish to live. */
export function DesignToolbar() {
  const qc = useQueryClient();
  const [authed, setAuthed] = useState(() => !!sessionStorage.getItem("admin_password"));
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const { data: logo = DEFAULT_LOGO } = useLogoSettings();
  const fonts = (qc.getQueryData(["site-fonts"]) as Fonts | undefined) ?? { logo: "current", serif: "current" };
  const [live, setLive] = useState<{ logo: LogoSettings; fonts: Fonts } | null>(null);

  useEffect(() => {
    const t = setInterval(() => setAuthed(!!sessionStorage.getItem("admin_password")), 1500);
    return () => clearInterval(t);
  }, []);

  if (!authed) return null;

  const snapshot = () => { if (!live) setLive({ logo, fonts }); };
  const setL = <K extends keyof LogoSettings>(k: K, v: LogoSettings[K]) => {
    snapshot();
    qc.setQueryData(["site-logo-settings"], { ...logo, [k]: v });
  };
  const setF = (k: keyof Fonts, v: string) => {
    snapshot();
    qc.setQueryData(["site-fonts"], { ...fonts, [k]: v });
  };

  const revert = () => {
    if (!live) return;
    qc.setQueryData(["site-logo-settings"], live.logo);
    qc.setQueryData(["site-fonts"], live.fonts);
    setLive(null);
    setStatus("Reverted");
  };

  const publish = async () => {
    setStatus("Publishing…");
    try {
      const entries: [string, string][] = (Object.keys(KEY_MAP) as (keyof LogoSettings)[])
        .map((k) => [KEY_MAP[k], String(logo[k])]);
      entries.push(["logo_font", fonts.logo], ["serif_font", fonts.serif]);
      if (fonts.bg) entries.push(["color_background", fonts.bg]);
      if (fonts.fg) entries.push(["color_foreground", fonts.fg]);
      for (const [id, value] of entries) await adminApi({ action: "update", table: "site_settings", id, data: { value } });
      setLive(null);
      setStatus("Published ✓");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Publish failed");
    }
  };

  const restore = () => {
    if (!confirm("Preview the standard settings? (Publish to make them live)")) return;
    snapshot();
    qc.setQueryData(["site-logo-settings"], DEFAULT_LOGO);
    qc.setQueryData(["site-fonts"], { logo: DEFAULT_SETTING_VALUES.logo_font, serif: DEFAULT_SETTING_VALUES.serif_font, bg: "#ffffff", fg: "#000000" });
  };

  const sel = (label: string, value: string, opts: readonly { value: string; label: string }[], on: (v: string) => void) => (
    <label className="flex items-center justify-between gap-2">
      <span>{label}</span>
      <select value={value} onChange={(e) => on(e.target.value)} className="max-w-[9rem] border border-border bg-background px-1 py-0.5">
        {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
  const range = (label: string, value: number, min: number, max: number, step: number, on: (v: number) => void) => (
    <label className="block">
      <span className="flex justify-between"><span>{label}</span><span>{value}</span></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => on(Number(e.target.value))} className="w-full accent-foreground" />
    </label>
  );
  const check = (label: string, value: boolean, on: (v: boolean) => void) => (
    <label className="flex items-center justify-between"><span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => on(e.target.checked)} className="accent-foreground" /></label>
  );
  const color = (label: string, value: string, on: (v: string) => void) => (
    <label className="flex items-center justify-between"><span>{label}</span>
      <input type="color" value={value} onChange={(e) => on(e.target.value)} className="h-5 w-10 border border-border" /></label>
  );

  return (
    <div data-design-toolbar className="fixed bottom-4 left-4 z-[70] font-sans text-[11px] text-foreground" style={{ cursor: "auto" }}>
      {open ? (
        <div className="max-h-[80vh] w-72 space-y-3 overflow-y-auto border border-border bg-background p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-[0.15em]">Design toolbar {live && "• preview"}</span>
            <button onClick={() => setOpen(false)} aria-label="Close toolbar">✕</button>
          </div>

          <p className="uppercase tracking-[0.15em] text-muted-foreground">Logo</p>
          <label className="block">Text
            <input value={logo.logoText} onChange={(e) => setL("logoText", e.target.value)} className="mt-1 w-full border border-border bg-background px-1 py-0.5" />
          </label>
          {range("Size", logo.logoSize, 8, 48, 1, (v) => setL("logoSize", v))}
          {range("Letter spacing", logo.logoSpacing, 0, 1, 0.01, (v) => setL("logoSpacing", v))}
          {check("All capitals", logo.logoUppercase, (v) => setL("logoUppercase", v))}
          {sel("Font", fonts.logo, fontOptions, (v) => setF("logo", v))}
          {sel("Placement", logo.logoPlacement, logoPlacementOptions, (v) => setL("logoPlacement", v as LogoSettings["logoPlacement"]))}

          <p className="uppercase tracking-[0.15em] text-muted-foreground">Breadcrumb</p>
          {check("Show", logo.breadcrumbShow, (v) => setL("breadcrumbShow", v))}
          {check("Sync size with logo", logo.breadcrumbSync, (v) => setL("breadcrumbSync", v))}
          {!logo.breadcrumbSync && range("Size", logo.breadcrumbSize, 8, 48, 1, (v) => setL("breadcrumbSize", v))}
          {!logo.breadcrumbSync && range("Letter spacing", logo.breadcrumbSpacing, 0, 1, 0.01, (v) => setL("breadcrumbSpacing", v))}
          {check("All capitals", logo.breadcrumbUppercase, (v) => setL("breadcrumbUppercase", v))}
          {sel("Font", logo.breadcrumbFont, breadcrumbFontOptions, (v) => setL("breadcrumbFont", v))}
          {sel("Separator", logo.breadcrumbSeparator, breadcrumbSeparatorOptions, (v) => setL("breadcrumbSeparator", v as LogoSettings["breadcrumbSeparator"]))}

          <p className="uppercase tracking-[0.15em] text-muted-foreground">Page</p>
          {sel("Text font", fonts.serif, fontOptions, (v) => setF("serif", v))}
          {color("Background", fonts.bg ?? "#ffffff", (v) => setF("bg", v))}
          {color("Text color", fonts.fg ?? "#000000", (v) => setF("fg", v))}
          {sel("Header", logo.headerMode, headerModeOptions, (v) => setL("headerMode", v as LogoSettings["headerMode"]))}
          {sel("Menu button", logo.menuButtonStyle, menuButtonStyleOptions, (v) => setL("menuButtonStyle", v as LogoSettings["menuButtonStyle"]))}
          {check("Custom cursor", logo.customCursor, (v) => setL("customCursor", v))}
          {check("Menu animations", logo.menuAnimations, (v) => setL("menuAnimations", v))}
          {check("Scroll controls", logo.showScrollControls, (v) => setL("showScrollControls", v))}

          <div className="space-y-1.5 border-t border-border pt-3">
            <button onClick={publish} className="w-full bg-foreground py-1.5 uppercase tracking-[0.15em] text-background">Publish to live</button>
            <div className="flex justify-between">
              <button onClick={revert} disabled={!live} className="underline disabled:opacity-40">Revert preview</button>
              <button onClick={restore} className="underline">Standard settings</button>
            </div>
            {status && <p className="text-muted-foreground">{status}</p>}
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="rounded-full border border-border bg-background px-3 py-1.5 uppercase tracking-[0.15em] shadow-sm">
          Design {live && "•"}
        </button>
      )}
    </div>
  );
}
