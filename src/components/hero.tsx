"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { site } from "@/content/site";
import { BELOW_BAR_MD, CELL, DISPLAY, EASE_EXPO, RULE, SITE_GRID } from "@/lib/tokens";
import { useIntroComplete } from "./intro";
import { useTheme } from "./theme";

function Wordmark({ text, ready, className }: { text: string; ready: boolean; className: string }) {
  return (
    <h1 id="hero-heading" className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ whiteSpace: ch === " " ? "pre" : "normal" }}
          initial={{ opacity: 0, y: 28 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.85, ease: EASE_EXPO, delay: 0.35 + 0.045 * i }}
        >
          {ch}
        </motion.span>
      ))}
    </h1>
  );
}

export function Hero() {
  const { ready, mediaHandedOff } = useIntroComplete();
  const { theme } = useTheme();
  const { image, video, videoPoster, portrait, roles, accentIcon, accentIconDark } = site.hero;
  const accent = theme === "dark" ? (accentIconDark ?? accentIcon) : accentIcon;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ready) videoRef.current?.play().catch(() => {});
  }, [ready]);

  const revealed = mediaHandedOff || ready;

  return (
    <section className={`flex flex-col border-b ${BELOW_BAR_MD} ${RULE}`}>
      <div className={`${SITE_GRID} md:min-h-[40svh] md:flex-1 border-b ${RULE}`}>
        <motion.div
          id="hero-media-card"
          className={`relative col-span-4 md:col-span-8 aspect-[4/3] md:aspect-auto md:h-full overflow-hidden border-b md:border-b-0 md:border-r ${RULE}`}
          initial={{ clipPath: "inset(0% 37%)" }}
          animate={revealed ? { clipPath: "inset(0% 0%)" } : undefined}
          // When the loader hands the media over, the card opens instantly underneath it.
          transition={{ duration: mediaHandedOff ? 0 : 1.2, ease: EASE_EXPO }}
        >
          {video ? (
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              poster={videoPoster?.url}
            >
              <source src={video.url} type={video.mimeType} />
            </video>
          ) : (
            image && <img src={image.url} alt={image.alt} className="absolute inset-0 h-full w-full object-cover" />
          )}
          <div className="pointer-events-none absolute inset-0" />
        </motion.div>
        <div className="relative col-span-4 md:col-span-4 aspect-[3/4] md:aspect-auto md:h-full overflow-hidden">
          {portrait && (
            <motion.div
              className="absolute inset-0"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={revealed ? { clipPath: "inset(0% 0% 0% 0%)" } : undefined}
              transition={{ duration: 1.1, ease: EASE_EXPO, delay: 0.35 }}
            >
              <img src={portrait.url} alt={portrait.alt} className="absolute inset-0 h-full w-full object-cover" />
            </motion.div>
          )}
        </div>
      </div>
      <div className={SITE_GRID}>
        <div className="col-span-4 flex items-end px-3 py-3 md:col-span-7 md:px-4 md:py-5">
          <Wordmark text={site.wordmark} ready={ready} className={DISPLAY} />
        </div>
        {roles.length > 0 && (
          <ul
            className={`col-span-3 md:col-span-3 md:border-l ${RULE} ${CELL} flex flex-col justify-end gap-1 text-base leading-[1.15] font-medium tracking-[-0.02em] md:text-xl lg:text-2xl`}
          >
            {roles.map((role, i) => (
              <motion.li
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={ready ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.6, ease: EASE_EXPO, delay: 0.5 + 0.08 * i }}
              >
                {role}
              </motion.li>
            ))}
          </ul>
        )}
        <div className={`col-span-1 md:col-span-2 md:border-l ${RULE} ${CELL} flex items-center justify-center`}>
          {accent && (
            <motion.img
              src={accent.url}
              alt={accent.alt}
              className="h-20 w-auto md:h-36"
              initial={{ opacity: 0, y: 16 }}
              animate={ready ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.7, ease: EASE_EXPO, delay: 0.6 }}
            />
          )}
        </div>
      </div>
    </section>
  );
}
