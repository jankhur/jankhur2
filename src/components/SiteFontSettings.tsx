import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isFontChoice, type FontChoice } from "@/lib/siteFonts";

const HEX = /^#[0-9a-f]{6}$/i;

function hexToHsl(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function SiteFontSettings() {
  const { data } = useQuery({
    queryKey: ["site-fonts"],
    queryFn: async (): Promise<{ logo: FontChoice; serif: FontChoice; bg?: string; fg?: string }> => {
      const { data: rows, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["logo_font", "serif_font", "color_background", "color_foreground"]);
      if (error) throw error;
      const settings = Object.fromEntries((rows ?? []).map(({ key, value }) => [key, value]));
      return {
        logo: isFontChoice(settings.logo_font ?? "") ? settings.logo_font as FontChoice : "current",
        serif: isFontChoice(settings.serif_font ?? "") ? settings.serif_font as FontChoice : "current",
        bg: HEX.test(settings.color_background ?? "") ? settings.color_background : undefined,
        fg: HEX.test(settings.color_foreground ?? "") ? settings.color_foreground : undefined,
      };
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.logoFont = data?.logo ?? "current";
    root.dataset.serifFont = data?.serif ?? "current";
    if (data?.bg && HEX.test(data.bg)) root.style.setProperty("--background", hexToHsl(data.bg));
    else root.style.removeProperty("--background");
    if (data?.fg && HEX.test(data.fg)) root.style.setProperty("--foreground", hexToHsl(data.fg));
    else root.style.removeProperty("--foreground");
  }, [data]);

  return null;
}
