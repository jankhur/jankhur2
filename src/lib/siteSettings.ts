import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeaderMode = "hide" | "always" | "fade";

export const headerModeOptions: { value: HeaderMode; label: string }[] = [
  { value: "hide", label: "Hide on scroll down, show on scroll up" },
  { value: "always", label: "Always visible (floating)" },
  { value: "fade", label: "Fade out after first photo" },
];

export const breadcrumbFontOptions = [
  { value: "logo", label: "Same as logo", family: "var(--font-logo)" },
  { value: "serif", label: "Same as serif text", family: "var(--font-serif)" },
  { value: "kristall", label: "KristallLL", family: "'KristallLL', 'Inter', sans-serif" },
  { value: "hedvig", label: "Hedvig Letters Serif", family: "'Hedvig Letters Serif', Georgia, serif" },
  { value: "times", label: "Times (free)", family: "'Times LT Pro', 'Times', 'Tinos', 'Times New Roman', serif" },
  { value: "texgyre", label: "TeX Gyre Termes", family: "'TeX Gyre Termes', 'Tinos', serif" },
  { value: "tinos", label: "Tinos", family: "'Tinos', 'Times New Roman', serif" },
] as const;

export type LogoSettings = {
  headerMode: HeaderMode;
  logoText: string;
  logoSize: number;
  logoSpacing: number;
  logoUppercase: boolean;
  showScrollControls: boolean;
  customCursor: boolean;
  menuAnimations: boolean;
  breadcrumbShow: boolean;
  breadcrumbSync: boolean;
  breadcrumbSize: number;
  breadcrumbSpacing: number;
  breadcrumbUppercase: boolean;
  breadcrumbFont: string;
};

export const DEFAULT_LOGO: LogoSettings = {
  headerMode: "hide",
  logoText: "JAN KHÜR",
  logoSize: 14,
  logoSpacing: 0.2,
  logoUppercase: true,
  showScrollControls: false,
  customCursor: true,
  menuAnimations: true,
  breadcrumbShow: true,
  breadcrumbSync: true,
  breadcrumbSize: 14,
  breadcrumbSpacing: 0.2,
  breadcrumbUppercase: true,
  breadcrumbFont: "logo",
};

/** Setting key -> stored string for every display default (used by "Restore standard"). */
export const DEFAULT_SETTING_VALUES: Record<string, string> = {
  header_mode: DEFAULT_LOGO.headerMode,
  logo_text: DEFAULT_LOGO.logoText,
  logo_size: String(DEFAULT_LOGO.logoSize),
  logo_spacing: String(DEFAULT_LOGO.logoSpacing),
  logo_uppercase: "true",
  show_scroll_controls: "false",
  custom_cursor: "true",
  menu_animations: "true",
  breadcrumb_show: "true",
  breadcrumb_sync: "true",
  breadcrumb_size: String(DEFAULT_LOGO.breadcrumbSize),
  breadcrumb_spacing: String(DEFAULT_LOGO.breadcrumbSpacing),
  breadcrumb_uppercase: "true",
  breadcrumb_font: "logo",
  logo_font: "current",
  serif_font: "current",
};

export const LOGO_KEYS = Object.keys(DEFAULT_SETTING_VALUES).filter((k) => k !== "logo_font" && k !== "serif_font");

const bool = (v: string | undefined, d: boolean) => (v == null || v === "" ? d : v === "true");
const num = (v: string | undefined, d: number) => (v != null && v !== "" && !isNaN(Number(v)) ? Number(v) : d);

export function useLogoSettings() {
  return useQuery({
    queryKey: ["site-logo-settings"],
    queryFn: async (): Promise<LogoSettings> => {
      const { data } = await supabase.from("site_settings").select("key, value").in("key", LOGO_KEYS);
      const v = Object.fromEntries((data ?? []).map(({ key, value }) => [key, value])) as Record<string, string | undefined>;
      const mode = v.header_mode as HeaderMode;
      return {
        headerMode: ["hide", "always", "fade"].includes(mode) ? mode : DEFAULT_LOGO.headerMode,
        logoText: v.logo_text || DEFAULT_LOGO.logoText,
        logoSize: Number(v.logo_size) || DEFAULT_LOGO.logoSize,
        logoSpacing: num(v.logo_spacing, DEFAULT_LOGO.logoSpacing),
        logoUppercase: bool(v.logo_uppercase, DEFAULT_LOGO.logoUppercase),
        showScrollControls: v.show_scroll_controls === "true",
        customCursor: bool(v.custom_cursor, DEFAULT_LOGO.customCursor),
        menuAnimations: bool(v.menu_animations, DEFAULT_LOGO.menuAnimations),
        breadcrumbShow: bool(v.breadcrumb_show, true),
        breadcrumbSync: bool(v.breadcrumb_sync, true),
        breadcrumbSize: Number(v.breadcrumb_size) || DEFAULT_LOGO.breadcrumbSize,
        breadcrumbSpacing: num(v.breadcrumb_spacing, DEFAULT_LOGO.breadcrumbSpacing),
        breadcrumbUppercase: bool(v.breadcrumb_uppercase, true),
        breadcrumbFont: breadcrumbFontOptions.some((o) => o.value === v.breadcrumb_font) ? v.breadcrumb_font! : "logo",
      };
    },
  });
}
