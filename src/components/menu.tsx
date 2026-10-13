"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { BAR_H, BAR_W, CELL, EASE_QUINT, LABEL, LINK, RULE } from "@/lib/tokens";
import { RollText } from "./roll-text";
import { useScrollVisibility } from "./use-scroll-visibility";

export function Menu() {
  const items = site.menu.items;
  const socials = site.menu.socials.filter((s) => !!s.url);
  const [hovered, setHovered] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [burgerHover, setBurgerHover] = useState(false);
  const pathname = usePathname();
  const lenis = useLenis();
  const barVisible = useScrollVisibility();
  const shown = open || barVisible;

  // Optional media shown when no item is hovered (the reference leaves it empty).
  const media = (hovered !== null ? items[hovered]?.media : null) ?? site.menu.media;
  const hasMedia = !!site.menu.media?.url || items.some((i) => i.media?.url);
  const isVideo = !!media?.mimeType?.startsWith("video");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      setBurgerHover(false);
      lenis?.stop();
    } else {
      setHovered(null);
      lenis?.start();
    }
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-brand-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onPointerEnter={() => setBurgerHover(true)}
        onPointerLeave={() => setBurgerHover(false)}
        className={`group fixed top-0 right-0 z-[52] flex ${BAR_H} ${BAR_W} cursor-pointer items-center justify-center border-b border-l bg-brand-cream transition-colors hover:bg-brand-primary ${RULE}`}
        animate={{ y: shown ? 0 : -120 }}
        transition={{ duration: 0.4, ease: EASE_QUINT }}
      >
        <span className="relative block h-4 w-6">
          <motion.span
            className="absolute left-0 block h-px w-full bg-brand-primary transition-colors group-hover:bg-brand-cream"
            initial={false}
            animate={open ? { top: "50%", rotate: 45 } : { top: burgerHover ? "22%" : "0%", rotate: 0 }}
            transition={{ duration: 0.3, ease: EASE_QUINT }}
          />
          <motion.span
            className="absolute top-1/2 left-0 block h-px w-full bg-brand-primary transition-colors group-hover:bg-brand-cream"
            initial={false}
            animate={{ opacity: open ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="absolute left-0 block h-px w-full bg-brand-primary transition-colors group-hover:bg-brand-cream"
            initial={false}
            animate={open ? { top: "50%", rotate: -45 } : { top: burgerHover ? "78%" : "100%", rotate: 0 }}
            transition={{ duration: 0.3, ease: EASE_QUINT }}
          />
        </span>
      </motion.button>

      <AnimatePresence>
        {open && hasMedia && (
          <motion.div
            key="menu-media"
            onClick={() => setOpen(false)}
            className="fixed inset-y-0 left-0 z-[51] hidden cursor-pointer overflow-hidden md:block md:w-1/2 lg:w-2/3"
            initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 0% 100%)" }}
            transition={{ duration: 0.6, ease: EASE_QUINT, delay: 0.08 }}
          >
            <AnimatePresence initial={false}>
              {media?.url && (
                <motion.div
                  key={media.url}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, transition: { duration: 0.2, delay: 0.55 } }}
                  transition={{ duration: 0.65, ease: EASE_QUINT }}
                >
                  {isVideo ? (
                    <video className="h-full w-full object-cover" src={media.url} muted loop autoPlay playsInline />
                  ) : (
                    <img src={media.url} alt={media.alt ?? ""} className="h-full w-full object-cover" />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className={`fixed inset-y-0 right-0 z-[51] flex w-full flex-col border-l bg-brand-cream text-brand-primary md:w-1/2 lg:w-1/3 ${RULE}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.5, ease: EASE_QUINT }}
          >
            <div className={`${BAR_H} shrink-0 border-b ${RULE}`} />
            <nav className="flex flex-1 flex-col justify-center">
              {items.map((item, i) => {
                const active = pathname === item.url;
                return (
                  <motion.div
                    key={item.url}
                    className={`border-b ${RULE}`}
                    onPointerEnter={() => setHovered(i)}
                    onPointerLeave={() => setHovered(null)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + 0.06 * i, duration: 0.4 }}
                  >
                    <Link
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className={`group/roll flex items-baseline gap-4 ${CELL} text-4xl font-bold tracking-[-0.16em] transition-colors hover:bg-brand-primary hover:text-brand-cream sm:text-5xl ${active ? "bg-brand-primary text-brand-cream" : ""}`}
                    >
                      <span className={`tabular-nums ${LABEL}`}>{String(i + 1).padStart(2, "0")}</span>
                      <RollText text={item.label} className="pr-[0.18em] leading-[1.15]" />
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
            {socials.length > 0 && (
              <div className={`flex flex-wrap items-center gap-x-6 gap-y-1 ${CELL} ${LINK}`}>
                {socials.map((s) => (
                  <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className="group/roll block">
                    <RollText text={s.label} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
