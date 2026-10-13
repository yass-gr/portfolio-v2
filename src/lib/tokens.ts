// Layout, type and motion tokens, named and valued as in the reference build.

export const BAR_H = "h-14 md:h-16";
export const BAR_MR = "mr-14 md:mr-16";
export const BAR_W = "w-14 md:w-16";
export const BELOW_BAR_MD = "md:min-h-[calc(100svh-4rem)]";
export const CELL = "p-3 md:p-4";
export const HAIR = "border-brand-primary/25";
export const RULE = "border-brand-primary/50";
export const SITE_GRID = "grid grid-cols-4 md:grid-cols-12";

export const DISPLAY =
  "text-[clamp(3.5rem,22vw,17rem)] leading-[0.8] font-bold tracking-[-0.13em]";
export const LABEL = "text-[0.65rem] tracking-[0.18em] uppercase";
export const LINK = "text-lg md:text-xl leading-[1.3] tracking-[0.06em] uppercase";

// House ease (expo-out) and the others the reference uses.
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_QUINT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT_CUBIC = [0.33, 0, 0.67, 1] as const;
export const EASE_IN_OUT_QUART = [0.76, 0, 0.24, 1] as const;
