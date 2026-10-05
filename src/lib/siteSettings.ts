import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type HeaderMode = "hide" | "always" | "fade";

export const headerModeOptions: { value: HeaderMode; label: string }[] = [
  { value: "hide", label: "Hide on scroll down, show on scroll up" },
  { value: "always", label: "Always visible (floating)" },
  { value: "fade", label: "Fade out after first photo" },
];

export type LogoSettings = {
  headerMode: HeaderMode;
  logoText: string;
  logoSize: number;
  logoSpacing: number;
};

export const DEFAULT_LOGO: LogoSettings = {
  headerMode: "hide",
  logoText: "JAN KHÜR",
  logoSize: 14,
  logoSpacing: 0.2,
};

export const LOGO_KEYS = ["header_mode", "logo_text", "logo_size", "logo_spacing"];

export function useLogoSettings() {
  return useQuery({
    queryKey: ["site-logo-settings"],
    queryFn: async (): Promise<LogoSettings> => {
      const { data } = await supabase.from("site_settings").select("key, value").in("key", LOGO_KEYS);
      const v = Object.fromEntries((data ?? []).map(({ key, value }) => [key, value]));
      const mode = v.header_mode as HeaderMode;
      return {
        headerMode: ["hide", "always", "fade"].includes(mode) ? mode : DEFAULT_LOGO.headerMode,
        logoText: v.logo_text || DEFAULT_LOGO.logoText,
        logoSize: Number(v.logo_size) || DEFAULT_LOGO.logoSize,
        logoSpacing: v.logo_spacing != null && v.logo_spacing !== "" ? Number(v.logo_spacing) : DEFAULT_LOGO.logoSpacing,
      };
    },
  });
}
