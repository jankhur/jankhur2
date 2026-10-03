export const fontOptions = [
  { value: "current", label: "Current" },
  { value: "hedvig", label: "Hedvig Letters Serif" },
  { value: "times", label: "Times (free)" },
  { value: "texgyre", label: "TeX Gyre Termes" },
  { value: "tinos", label: "Tinos" },
] as const;

export type FontChoice = (typeof fontOptions)[number]["value"];

export const isFontChoice = (value: string): value is FontChoice =>
  fontOptions.some((option) => option.value === value);