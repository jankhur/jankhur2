import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { isFontChoice, type FontChoice } from "@/lib/siteFonts";

export function SiteFontSettings() {
  const { data } = useQuery({
    queryKey: ["site-fonts"],
    queryFn: async (): Promise<{ logo: FontChoice; serif: FontChoice }> => {
      const { data: rows, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["logo_font", "serif_font"]);
      if (error) throw error;
      const settings = Object.fromEntries((rows ?? []).map(({ key, value }) => [key, value]));
      return {
        logo: isFontChoice(settings.logo_font ?? "") ? settings.logo_font as FontChoice : "current",
        serif: isFontChoice(settings.serif_font ?? "") ? settings.serif_font as FontChoice : "current",
      };
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.logoFont = data?.logo ?? "current";
    root.dataset.serifFont = data?.serif ?? "current";
  }, [data]);

  return null;
}