"use client";

import { motion } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { EASE_IN_OUT_QUART } from "@/lib/tokens";

export const STORAGE_KEY = "portfolio-theme";

type Theme = "light" | "dark";

const BG: Record<Theme, string> = { light: "#b2c7ab", dark: "#6a0c06" };
const FG: Record<Theme, string> = { light: "#6a0c06", dark: "#b2c7ab" };

const ThemeContext = createContext<{ theme: Theme; toggle: () => void; busy: boolean }>({
  theme: "light",
  toggle: () => {},
  busy: false,
});

// Runs before paint (inlined in <head>) so a saved dark theme never flashes light.
export const themeScript = `try{if(localStorage.getItem('${STORAGE_KEY}')==='dark'){document.documentElement.dataset.theme='dark'}}catch(e){}`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<Theme>("dark");

  useEffect(() => {
    if (document.documentElement.dataset.theme === "dark") setTheme("dark");
  }, []);

  const toggle = useCallback(() => {
    if (busy) return;
    const next: Theme = theme === "light" ? "dark" : "light";
    setTarget(next);
    setBusy(true);
    // The colours flip at 500ms, while the skewed panel covers the screen.
    setTimeout(() => {
      setTheme(next);
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", BG[next]);
    }, 500);
    setTimeout(() => setBusy(false), 1000);
  }, [busy, theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle, busy }}>
      {children}
      {busy && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
          <motion.div
            className="absolute top-0 -left-[10vw] h-full w-[120vw] border-x"
            style={{ backgroundColor: BG[target], borderColor: FG[target], skewX: -10 }}
            initial={{ x: "-115%" }}
            animate={{ x: "115%" }}
            transition={{ duration: 1, ease: EASE_IN_OUT_QUART }}
          />
        </div>
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
