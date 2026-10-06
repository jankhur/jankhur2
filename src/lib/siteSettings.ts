import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeaderMode = "hide" | "always" | "fade";
export type LogoPlacement = "tight" | "current" | "center";
export type BreadcrumbSeparator = "dot" | "dash" | "slash";
export type MenuButtonStyle = "hamburger" | "dot" | "text";

export const headerModeOptions: { value: HeaderMode; label: string }[] = [
  { value: "hide", label: "Hide on scroll down, show on scroll up" },
  { value: "always", label: "Always visible (floating)" },
  { value: "fade", label: "Fade out after first photo" },
];

export const logoPlacementOptions: { value: LogoPlacement; label: string }[] = [
  { value: "tight", label: "Top left — tight" },
  { value: "current", label: "Top left — current" },
  { value: "center", label: "Top center" },
];

export const breadcrumbSeparatorOptions: { value: BreadcrumbSeparator; label: string; character: string }[] = [
  { value: "dot", label: "Dot ·", character: "·" },
  { value: "dash", label: "Dash —", character: "—" },
  { value: "slash", label: "Slash /", character: "/" },
];

export const menuButtonStyleOptions: { value: MenuButtonStyle; label: string }[] = [
  { value: "hamburger", label: "Hamburger" },
  { value: "dot", label: "Dot" },
  { value: "text", label: "MENU text" },
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
  logoPlacement: LogoPlacement;
  menuButtonStyle: MenuButtonStyle;
  showScrollControls: boolean;
  customCursor: boolean;
  menuAnimations: boolean;
  breadcrumbShow: boolean;
  breadcrumbSync: boolean;
  breadcrumbSize: number;
  breadcrumbSpacing: number;
  breadcrumbUppercase: boolean;
  breadcrumbFont: string;
  breadcrumbSeparator: BreadcrumbSeparator;
};

export const DEFAULT_LOGO: LogoSettings = {
  headerMode: "hide",
  logoText: "JAN KHÜR",
  logoSize: 14,
  logoSpacing: 0.2,
  logoUppercase: true,
  logoPlacement: "current",
  menuButtonStyle: "hamburger",
  showScrollControls: false,
  customCursor: true,
  menuAnimations: true,
  breadcrumbShow: true,
  breadcrumbSync: true,
  breadcrumbSize: 14,
  breadcrumbSpacing: 0.2,
  breadcrumbUppercase: false,
  breadcrumbFont: "logo",
  breadcrumbSeparator: "dot",
};

/** Setting key -> stored string for every display default (used by "Restore standard"). */
export const DEFAULT_SETTING_VALUES: Record<string, string> = {
  header_mode: DEFAULT_LOGO.headerMode,
  logo_text: DEFAULT_LOGO.logoText,
  logo_size: String(DEFAULT_LOGO.logoSize),
  logo_spacing: String(DEFAULT_LOGO.logoSpacing),
  logo_uppercase: "true",
  logo_placement: DEFAULT_LOGO.logoPlacement,
  menu_button_style: DEFAULT_LOGO.menuButtonStyle,
  show_scroll_controls: "false",
  custom_cursor: "true",
  menu_animations: "true",
  breadcrumb_show: "true",
  breadcrumb_sync: "true",
  breadcrumb_size: String(DEFAULT_LOGO.breadcrumbSize),
  breadcrumb_spacing: String(DEFAULT_LOGO.breadcrumbSpacing),
  breadcrumb_uppercase: "false",
  breadcrumb_font: "logo",
  breadcrumb_separator: DEFAULT_LOGO.breadcrumbSeparator,
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
      const placement = v.logo_placement as LogoPlacement;
      const menuButtonStyle = v.menu_button_style as MenuButtonStyle;
      const separator = v.breadcrumb_separator as BreadcrumbSeparator;
      return {
        headerMode: ["hide", "always", "fade"].includes(mode) ? mode : DEFAULT_LOGO.headerMode,
        logoText: v.logo_text || DEFAULT_LOGO.logoText,
        logoSize: Number(v.logo_size) || DEFAULT_LOGO.logoSize,
        logoSpacing: num(v.logo_spacing, DEFAULT_LOGO.logoSpacing),
        logoUppercase: bool(v.logo_uppercase, DEFAULT_LOGO.logoUppercase),
        logoPlacement: logoPlacementOptions.some((o) => o.value === placement) ? placement : DEFAULT_LOGO.logoPlacement,
        menuButtonStyle: menuButtonStyleOptions.some((o) => o.value === menuButtonStyle) ? menuButtonStyle : DEFAULT_LOGO.menuButtonStyle,
        showScrollControls: v.show_scroll_controls === "true",
        customCursor: bool(v.custom_cursor, DEFAULT_LOGO.customCursor),
        menuAnimations: bool(v.menu_animations, DEFAULT_LOGO.menuAnimations),
        breadcrumbShow: bool(v.breadcrumb_show, true),
        breadcrumbSync: bool(v.breadcrumb_sync, true),
        breadcrumbSize: Number(v.breadcrumb_size) || DEFAULT_LOGO.breadcrumbSize,
        breadcrumbSpacing: num(v.breadcrumb_spacing, DEFAULT_LOGO.breadcrumbSpacing),
        breadcrumbUppercase: bool(v.breadcrumb_uppercase, DEFAULT_LOGO.breadcrumbUppercase),
        breadcrumbFont: breadcrumbFontOptions.some((o) => o.value === v.breadcrumb_font) ? String(v.breadcrumb_font) : "logo",
        breadcrumbSeparator: breadcrumbSeparatorOptions.some((o) => o.value === separator) ? separator : DEFAULT_LOGO.breadcrumbSeparator,
      };
    },
  });
}
