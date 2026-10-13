"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { site } from "@/content/site";
import { BAR_H, BAR_MR, EASE_EXPO, EASE_QUINT, LABEL, RULE, SITE_GRID } from "@/lib/tokens";
import { RollText } from "./roll-text";
import { useTheme } from "./theme";
import { useScrollVisibility } from "./use-scroll-visibility";

const CLOCKS = site.clocks;

function zoneCode(clock: (typeof CLOCKS)[number], now: Date) {
  if (!clock.locale) return clock.code;
  const name = new Intl.DateTimeFormat(clock.locale, { timeZone: clock.tz, timeZoneName: "short" })
    .formatToParts(now)
    .find((p) => p.type === "timeZoneName")?.value;
  return !name || /^(GMT|UTC)[+-]/.test(name) ? clock.code : name;
}

function useClockReadings() {
  const [readings, setReadings] = useState(() => CLOCKS.map((c) => ({ time: "--:--:--", code: c.code })));

  useEffect(() => {
    const formats = CLOCKS.map(
      (c) =>
        new Intl.DateTimeFormat("en-GB", {
          timeZone: c.tz,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
    );
    const tick = () => {
      const now = new Date();
      setReadings(CLOCKS.map((c, i) => ({ time: formats[i].format(now), code: zoneCode(c, now) })));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return readings;
}

function ClockRow({ readings }: { readings: { time: string; code: string }[] }) {
  return (
    <span className="flex shrink-0 items-center">
      {CLOCKS.map((c, i) => (
        <span key={c.tz} className="flex shrink-0 items-center whitespace-nowrap">
          <span
            className={
              c.home
                ? "flex items-center gap-2 bg-brand-primary px-2.5 py-1 font-bold text-brand-cream"
                : "flex items-center gap-2"
            }
          >
            <span>{c.label}</span>
            <span className="tabular-nums">{readings[i].time}</span>
            <span className={c.home ? "opacity-70" : "opacity-40"}>{readings[i].code}</span>
          </span>
          <span aria-hidden="true" className="px-5 opacity-40">
            /
          </span>
        </span>
      ))}
    </span>
  );
}

function WorldClocks() {
  const readings = useClockReadings();
  return (
    <div
      className="group relative h-full overflow-hidden"
      role="status"
      aria-live="off"
      aria-label={`Local times. ${CLOCKS.map((c, i) => `${c.label} ${readings[i].time}`).join(". ")}.`}
    >
      <div
        className={`animate-marquee flex h-full w-max items-center ${LABEL} group-hover:[animation-play-state:paused]`}
        aria-hidden="true"
      >
        {[0, 1].map((k) => (
          <ClockRow key={k} readings={readings} />
        ))}
      </div>
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle, busy } = useTheme();
  const [hover, setHover] = useState(false);
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      disabled={busy}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group group/roll flex h-full cursor-pointer items-center gap-2.5 px-4 transition-colors hover:bg-brand-primary hover:text-brand-cream disabled:cursor-default ${BAR_MR}`}
    >
      <RollText text={dark ? "Dark" : "Light"} className={`leading-[1.4] ${LABEL}`} />
      <span
        className="relative block h-3 w-3 overflow-hidden border border-brand-primary transition-colors group-hover:border-brand-cream"
        aria-hidden="true"
      >
        <motion.span
          className="absolute inset-0 bg-brand-primary transition-colors group-hover:bg-brand-cream"
          initial={false}
          animate={{ x: hover ? "-50%" : dark ? "0%" : "-100%" }}
          transition={{ duration: 0.45, ease: EASE_EXPO }}
        />
      </span>
    </button>
  );
}

export function Header() {
  const visible = useScrollVisibility();
  const { theme } = useTheme();
  const logo = theme === "dark" ? (site.logoDark ?? site.logo) : site.logo;

  return (
    <motion.header
      className={`fixed inset-x-0 top-0 z-30 border-b bg-brand-cream ${BAR_H} ${RULE} ${SITE_GRID}`}
      animate={{ y: visible ? 0 : -120 }}
      transition={{ duration: 0.4, ease: EASE_QUINT }}
    >
      <Link
        href="/"
        className={`col-span-2 md:col-span-3 flex items-center border-r px-3 text-2xl font-bold tracking-[-0.06em] md:px-4 md:text-3xl ${RULE}`}
      >
        {logo ? (
          <img src={logo.url} alt={logo.alt} className="h-7 w-auto md:h-9" />
        ) : (
          <span>{site.wordmark}</span>
        )}
      </Link>
      <div className={`hidden md:col-span-6 md:block border-r ${RULE}`}>
        <WorldClocks />
      </div>
      <div className="col-span-2 md:col-span-3 flex items-stretch justify-end">
        <ThemeToggle />
      </div>
    </motion.header>
  );
}
