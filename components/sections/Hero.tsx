"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import { Diary } from "@/components/ui/Diary";
import { HiBadge } from "@/components/ui/Primitives";
import { Tilt3D } from "@/components/ui/Tilt3D";
import { L } from "@/components/ui/L";
import profile from "@/data/profile.json";

function useIsLg() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1024px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => true,
  );
}

/**
 * Letters rise out of a mask one by one (CSS, so it plays before JS loads),
 * then lift and turn accent on hover.
 */
function SplitWord({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className={`relative inline-flex overflow-hidden pb-[0.06em] ${className}`}
    >
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className="rise inline-block whitespace-pre"
          style={{ animationDelay: `${delay + i * 0.045}s` }}
        >
          <span className="inline-block cursor-default transition-[transform,color] duration-200 hover:-translate-y-[12%] hover:text-accent">
            {ch}
          </span>
        </span>
      ))}
    </span>
  );
}

const big =
  "display font-bold text-[56px] sm:text-[88px] lg:text-[clamp(60px,7.4vw,112px)]";

/**
 * The hero is taller than the viewport and its content is pinned; scrolling
 * through it opens the diary (and scrolling back closes it).
 */
export function Hero() {
  const [left, right] = profile.heroWords;
  const ref = useRef<HTMLElement>(null);
  const isLg = useIsLg();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.4,
  });
  const open = useTransform(progress, [0.05, 0.75], [0, 1], { clamp: true });

  // the spread opens around the centre: shift the book right by half its width
  const bookX = useTransform(open, [0, 1], ["0%", "50%"]);
  const bookScale = useTransform(open, [0, 1], [1, isLg ? 1 : 0.78]);
  const sideX = useTransform(open, [0, 1], [0, isLg ? 200 : 0]);
  const leftX = useTransform(sideX, (v) => -v);
  const sideOpacity = useTransform(open, [0, 0.6], [1, isLg ? 0.12 : 0]);
  const badgeOpacity = useTransform(open, [0, 0.15], [1, 0]);
  const hintOpacity = useTransform(open, [0, 0.1], [1, 0]);

  return (
    <section ref={ref} className="relative h-[220vh] overflow-x-clip">
      <div className="sticky top-0 mx-auto flex h-[100svh] w-full max-w-[1440px] items-center px-4 py-24 md:px-10">
        <div className="grid w-full items-center gap-4 text-center lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-6">
          <motion.div
            className="lg:text-right"
            style={{ x: leftX, opacity: sideOpacity }}
          >
            <div className="relative inline-block text-center lg:text-left">
              <p className="display text-2xl md:text-[28px] lg:absolute lg:bottom-full lg:left-0 lg:mb-1 lg:whitespace-nowrap">
                <SplitWord text={profile.heroLabel} delay={0.1} />
              </p>
              <h1 className={`${big} mt-2 lg:mt-0`}>
                <SplitWord text={left} delay={0.35} />
              </h1>
            </div>
          </motion.div>

          <div className="pop-in relative z-10 mx-auto">
            <motion.div style={{ x: bookX, scale: bookScale }}>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Tilt3D max={6} shine={false}>
                  <Diary
                    open={open}
                    className="h-[290px] w-[210px] sm:h-[400px] sm:w-[290px] xl:h-[480px] xl:w-[340px]"
                  />
                </Tilt3D>
              </motion.div>
            </motion.div>

            <motion.div
              className="absolute -bottom-5 -left-5 z-20 md:-bottom-7 md:-left-8"
              style={{ opacity: badgeOpacity }}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 18,
                delay: 0.9,
              }}
            >
              <HiBadge className="h-[64px] w-[64px] md:h-[90px] md:w-[90px]" />
            </motion.div>

            <motion.p
              style={{ opacity: hintOpacity }}
              className="hand absolute -bottom-14 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xl whitespace-nowrap text-muted sm:flex"
            >
              <L k="hero.hint">scroll to open my diary</L>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </motion.p>
          </div>

          <motion.div
            className="lg:text-left"
            style={{ x: sideX, opacity: sideOpacity }}
          >
            <div className="relative inline-block lg:text-right">
              <h1 className={big}>
                <SplitWord text={right} delay={0.5} />
              </h1>
              <p className="mx-auto mt-3 max-w-[260px] text-[15px] leading-relaxed text-muted lg:absolute lg:top-full lg:right-0 lg:mr-0 lg:ml-auto">
                <L k="hero.tagline">{profile.tagline}</L>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
