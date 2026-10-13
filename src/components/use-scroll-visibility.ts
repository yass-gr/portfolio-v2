"use client";

import { useEffect, useRef, useState } from "react";

// Header hides after 80px when scrolling down by more than 4px, returns on scroll up.
export function useScrollVisibility() {
  const [visible, setVisible] = useState(true);
  const last = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      const delta = y - last.current;
      if (y < 80) setVisible(true);
      else if (delta > 4) setVisible(false);
      else if (delta < -4) setVisible(true);
      last.current = y;
    }
    last.current = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
