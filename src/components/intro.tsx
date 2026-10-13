"use client";

import { useLenis } from "lenis/react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { CELL, EASE_EXPO, EASE_IN_OUT_CUBIC, RULE, SITE_GRID } from "@/lib/tokens";
import { useTheme } from "./theme";

// Home loader: a 3D hairline "room" flies in while a 000→100 counter runs,
// flattens into the page grid, hands the hero media to #hero-media-card,
// then 12 columns wipe down. Timings are the reference's, in ms.
const T_HIDE_WALLS = 1900;
const T_FLATTEN = 2400;
const T_HANDOFF = 3250;
const T_MEDIA_EXTRA = 250;
const T_WIPE = 520 + 12 * 11;

type Phase = "counting" | "flattening" | "handoff" | "wiping" | "done";
const PHASES: Phase[] = ["counting", "flattening", "handoff", "wiping", "done"];
const atLeast = (p: Phase, q: Phase) => PHASES.indexOf(p) >= PHASES.indexOf(q);

type Rect = { top: number; left: number; width: number; height: number };

const IntroContext = createContext({ ready: true, mediaHandedOff: false });

export function useIntroComplete() {
  return useContext(IntroContext);
}

const LINE = "color-mix(in srgb, var(--color-brand-primary) 38%, transparent)";
function gridLines(cols: number, rows: number): React.CSSProperties {
  return {
    backgroundImage: `repeating-linear-gradient(to right, ${LINE} 0 1px, transparent 1px calc(100% / ${cols})),repeating-linear-gradient(to bottom, ${LINE} 0 1px, transparent 1px calc(100% / ${rows}))`,
  };
}

// The intro plays once per page load.
let played = false;

function IntroMedia() {
  const { video, videoPoster, image } = site.hero;
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video || videoPoster) return;
    const el = ref.current;
    if (!el) return;
    // Without a poster, nudge the first frame so the video isn't blank.
    const onLoaded = () => {
      if (el.currentTime === 0) el.currentTime = 0.01;
    };
    el.addEventListener("loadeddata", onLoaded);
    return () => el.removeEventListener("loadeddata", onLoaded);
  }, [video, videoPoster]);

  if (video)
    return (
      <video ref={ref} className="h-full w-full object-cover" muted playsInline preload="auto" poster={videoPoster?.url}>
        <source src={video.url} />
      </video>
    );
  if (image) return <img src={image.url} alt="" className="h-full w-full object-cover" />;
  return null;
}

function RoomWalls({ visible }: { visible: boolean }) {
  const base = "absolute backface-hidden";
  const fade = { animate: { opacity: visible ? 1 : 0 }, transition: { duration: 0.75, ease: "easeInOut" as const } };
  return (
    <>
      <motion.div
        className={`${base} left-0 w-full`}
        style={{ top: "100%", height: 1100, transformOrigin: "50% 0%", transform: "rotateX(-90deg)", ...gridLines(12, 6) }}
        initial={{ opacity: 0 }}
        {...fade}
      />
      <motion.div
        className={`${base} left-0 w-full`}
        style={{ bottom: "100%", height: 1100, transformOrigin: "50% 100%", transform: "rotateX(90deg)", ...gridLines(12, 6) }}
        initial={{ opacity: 0 }}
        {...fade}
      />
      <motion.div
        className={`${base} top-0 left-0 h-full`}
        style={{ width: 1100, transformOrigin: "0% 50%", transform: "rotateY(90deg)", ...gridLines(6, 7) }}
        initial={{ opacity: 0 }}
        {...fade}
      />
      <motion.div
        className={`${base} top-0 right-0 h-full`}
        style={{ width: 1100, transformOrigin: "100% 50%", transform: "rotateY(-90deg)", ...gridLines(6, 7) }}
        initial={{ opacity: 0 }}
        {...fade}
      />
    </>
  );
}

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const hasMedia = !!(site.hero.video || site.hero.image);
  const { theme } = useTheme();
  const logo = theme === "dark" ? (site.logoDark ?? site.logo) : site.logo;
  const isHome = usePathname() === "/";

  const [phase, setPhase] = useState<Phase>(() => (played || !isHome ? "done" : "counting"));
  const [wallsHidden, setWallsHidden] = useState(false);
  const [startRect, setStartRect] = useState<Rect | null>(null);
  const [cardRect, setCardRect] = useState<Rect | null>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(progress, (v) => v / 100);

  useEffect(() => {
    if (phase === "done") {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "done") played = true;
  }, [phase]);

  useEffect(() => {
    if (!isHome || played) return;
    const w = planeRef.current?.offsetWidth ?? window.innerWidth;
    const h = planeRef.current?.offsetHeight ?? window.innerHeight;
    // Media starts in the room: columns 7–11, rows 2–4 of the 12×7 grid.
    setStartRect({ left: w * 0.5, top: h / 7, width: (w * 5) / 12, height: (h * 3) / 7 });

    const count = animate(progress, 100, { duration: 2.4, ease: EASE_EXPO });
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const wipeAt = T_HANDOFF + (hasMedia ? T_MEDIA_EXTRA : 0);

    at(T_HIDE_WALLS, () => setWallsHidden(true));
    at(T_FLATTEN, () => setPhase("flattening"));
    at(T_HANDOFF, () => {
      const card = document.getElementById("hero-media-card");
      if (card) {
        const r = card.getBoundingClientRect();
        setCardRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
      setPhase("handoff");
    });
    at(wipeAt, () => setPhase("wiping"));
    at(wipeAt + T_WIPE, () => setPhase("done"));

    return () => {
      count.stop();
      timers.forEach(clearTimeout);
    };
  }, [progress, hasMedia, isHome]);

  // While handing off, keep the flying media glued to the hero card.
  useEffect(() => {
    if (!atLeast(phase, "handoff") || phase === "done") return;
    const card = document.getElementById("hero-media-card");
    if (!card) return;
    let key = "";
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const r = card.getBoundingClientRect();
      const k = `${r.top}|${r.left}|${r.width}|${r.height}`;
      if (k !== key) {
        key = k;
        setCardRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") lenis?.start();
    else lenis?.stop();
  }, [phase, lenis]);

  const flat = phase !== "counting";
  const handedOff = atLeast(phase, "handoff");
  const mediaHandedOff = hasMedia && !!cardRect;

  return (
    <IntroContext.Provider value={{ ready: phase === "done", mediaHandedOff }}>
      {phase !== "done" && (
        <div id="intro-overlay" className="fixed inset-0 z-[100] overflow-hidden">
          <noscript>
            <style dangerouslySetInnerHTML={{ __html: "#intro-overlay{display:none!important}" }} />
          </noscript>
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-0 h-full bg-brand-cream"
              style={{ left: `${(i / 12) * 100}%`, width: `${100 / 12 + 0.05}%` }}
              initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
              animate={{ clipPath: phase === "wiping" ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 0.52, ease: EASE_EXPO, delay: phase === "wiping" ? (12 * i) / 1000 : 0 }}
            />
          ))}
          <div className="absolute inset-0 z-10" style={{ perspective: "1000px", perspectiveOrigin: "50% 50%" }}>
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: "preserve-3d" }}
              initial={{ z: -260, rotateY: 7, rotateX: -3 }}
              animate={flat ? { z: 0, rotateY: 0, rotateX: 0 } : { z: 150, rotateY: -4, rotateX: 1 }}
              transition={{ duration: flat ? 0.85 : 2.4, ease: flat ? EASE_EXPO : EASE_IN_OUT_CUBIC }}
            >
              <RoomWalls visible={!wallsHidden} />
              <motion.div
                ref={planeRef}
                className="absolute inset-0"
                style={{ transformStyle: "preserve-3d" }}
                initial={{ z: -1100 }}
                animate={{ z: flat ? 0 : -1100 }}
                transition={{ duration: 0.85, ease: EASE_EXPO }}
              >
                <motion.div
                  className="absolute inset-0"
                  style={gridLines(12, 7)}
                  initial={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  animate={{ clipPath: handedOff ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 0% 0%)" }}
                  transition={{ duration: 0.902, ease: EASE_EXPO }}
                />
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: handedOff ? 0 : 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <div className="absolute" style={{ left: `${100 / 12}%`, top: `${400 / 7}%` }}>
                    {logo ? (
                      <motion.img
                        src={logo.url}
                        alt={logo.alt}
                        className="h-[10vh] w-auto"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.5 }}
                      />
                    ) : (
                      <motion.span
                        className="block text-[10vw] leading-[0.78] font-bold tracking-[-0.13em] text-brand-primary"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.5 }}
                      >
                        {site.wordmark}
                      </motion.span>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 flex h-[calc(100%/7)] flex-col">
                    <motion.div className="h-px w-full origin-left bg-brand-primary" style={{ scaleX: bar }} />
                    <div className={`${SITE_GRID} min-h-0 flex-1`}>
                      <div className={`col-span-2 md:col-span-3 border-r ${RULE} ${CELL} flex items-end`}>
                        <motion.span className="block text-[clamp(2rem,6vw,4.5rem)] leading-none font-bold tabular-nums text-brand-primary">
                          {counter}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                {hasMedia && startRect && (
                  <motion.div
                    className="absolute overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ ...(handedOff && cardRect ? cardRect : startRect), opacity: 1 }}
                    transition={{ duration: 0.75, ease: EASE_EXPO, opacity: { duration: 0.7, ease: EASE_EXPO, delay: 0.5 } }}
                  >
                    <IntroMedia />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
      {children}
    </IntroContext.Provider>
  );
}
