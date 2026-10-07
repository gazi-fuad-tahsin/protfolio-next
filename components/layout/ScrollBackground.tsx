"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useSyncExternalStore } from "react";

/**
 * Site-wide backdrop that reacts to scroll: drifting colour glows, a parallax
 * dot grid, floating code glyphs, and a "journey" line in the side gutters
 * that draws itself as you move down the page.
 */
export function ScrollBackground() {
  const reduce = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 });

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Glows scrollY={scrollY} reduce={!!reduce} />
      <DotGrid scrollY={scrollY} reduce={!!reduce} />
      <Glyphs scrollY={scrollY} reduce={!!reduce} />
      <JourneyPath progress={reduce ? scrollYProgress : progress} side="left" />
      <JourneyPath progress={reduce ? scrollYProgress : progress} side="right" />
    </div>
  );
}

/* ------------------------------------------------------------------ glows */

function Glows({ scrollY, reduce }: { scrollY: MotionValue<number>; reduce: boolean }) {
  const f = reduce ? 0 : 1;
  const y1 = useTransform(scrollY, (v) => Math.sin(v / 900) * 120 * f);
  const x1 = useTransform(scrollY, (v) => Math.cos(v / 1300) * 80 * f);
  const y2 = useTransform(scrollY, (v) => Math.cos(v / 700) * 140 * f);
  const x2 = useTransform(scrollY, (v) => Math.sin(v / 1100) * 100 * f);
  const y3 = useTransform(scrollY, (v) => Math.sin(v / 1500 + 2) * 160 * f);
  const s3 = useTransform(scrollY, (v) => 1 + Math.sin(v / 1000) * 0.15 * f);

  return (
    <>
      <motion.div
        style={{ x: x1, y: y1 }}
        className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-accent opacity-[0.10] blur-[110px] dark:opacity-[0.06]"
      />
      <motion.div
        style={{ x: x2, y: y2 }}
        className="absolute top-1/3 -right-48 h-[480px] w-[480px] rounded-full bg-[#e0567a] opacity-[0.07] blur-[120px] dark:opacity-[0.06]"
      />
      <motion.div
        style={{ y: y3, scale: s3 }}
        className="absolute -bottom-48 left-1/4 h-[460px] w-[460px] rounded-full bg-[#2dd4bf] opacity-[0.06] blur-[120px] dark:opacity-[0.05]"
      />
    </>
  );
}

/* --------------------------------------------------------------- dot grid */

function DotGrid({ scrollY, reduce }: { scrollY: MotionValue<number>; reduce: boolean }) {
  const pos = useTransform(scrollY, (v) => `0px ${reduce ? 0 : -(v * 0.15) % 28}px`);
  return (
    <motion.div
      className="absolute inset-0 text-fg opacity-[0.06] dark:opacity-[0.08]"
      style={{
        backgroundImage: "radial-gradient(currentColor 1px, transparent 1.2px)",
        backgroundSize: "28px 28px",
        backgroundPosition: pos,
        maskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 80%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 65% at 50% 40%, black 20%, transparent 80%)",
      }}
    />
  );
}

/* ----------------------------------------------------------------- glyphs */

const glyphs = [
  { t: "{ }", x: "6%", top: 0.12, speed: 0.25, size: 34, rot: 40 },
  { t: "</>", x: "91%", top: 0.28, speed: 0.4, size: 30, rot: -60 },
  { t: "=>", x: "13%", top: 0.62, speed: 0.55, size: 26, rot: 90 },
  { t: "[ ]", x: "84%", top: 0.78, speed: 0.3, size: 28, rot: -30 },
  { t: "&&", x: "47%", top: 0.95, speed: 0.2, size: 22, rot: 25 },
  { t: "//", x: "72%", top: 0.05, speed: 0.6, size: 24, rot: 70 },
  { t: "( )", x: "28%", top: 0.4, speed: 0.35, size: 24, rot: -45 },
  { t: "$_", x: "60%", top: 0.55, speed: 0.45, size: 22, rot: 50 },
];

/** true only in the browser — glyph positions depend on window size, so they're client-only */
const noop = () => () => {};
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

function Glyphs({ scrollY, reduce }: { scrollY: MotionValue<number>; reduce: boolean }) {
  const isClient = useIsClient();
  if (!isClient) return null;
  return (
    <>
      {glyphs.map((g) => (
        <Glyph key={g.t} g={g} scrollY={scrollY} reduce={reduce} />
      ))}
    </>
  );
}

function Glyph({ g, scrollY, reduce }: { g: (typeof glyphs)[number]; scrollY: MotionValue<number>; reduce: boolean }) {
  // Moves up at its own speed and wraps around, so glyphs keep flowing past.
  const y = useTransform(scrollY, (v) => {
    const range = typeof window === "undefined" ? 1000 : window.innerHeight + 160;
    const start = g.top * range;
    const moved = reduce ? start : start - v * g.speed;
    return (((moved % range) + range) % range) - 80;
  });
  const rotate = useTransform(scrollY, (v) => (reduce ? 0 : (v / 1000) * g.rot));

  return (
    <motion.span
      style={{ y, rotate, left: g.x, fontSize: g.size }}
      className="display absolute top-0 font-bold text-accent opacity-[0.16] select-none dark:opacity-[0.12]"
    >
      {g.t}
    </motion.span>
  );
}

/* ----------------------------------------------------------- journey path */

// A long meander in a 100 × 1000 box, stretched to the gutter's height.
const path =
  "M50 0 C 90 60, 90 120, 50 170 S 10 280, 50 340 S 90 450, 50 510 S 10 620, 50 680 S 90 790, 50 850 S 10 950, 50 1000";
const milestones = [0.17, 0.34, 0.51, 0.68, 0.85];

function JourneyPath({ progress, side }: { progress: MotionValue<number>; side: "left" | "right" }) {
  const ref = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGGElement>(null);

  // keep the glowing head at the tip of the drawn line
  useMotionValueEvent(progress, "change", (p) => {
    const el = ref.current;
    const head = headRef.current;
    if (!el || !head) return;
    const pt = el.getPointAtLength(el.getTotalLength() * Math.min(Math.max(p, 0), 1));
    head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
  });

  return (
    <svg
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      className={`absolute inset-y-0 hidden h-full w-[88px] xl:block ${side === "left" ? "left-6" : "right-6 -scale-x-100"}`}
    >
      {/* faint full route */}
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1" className="text-fg opacity-[0.08]" vectorEffect="non-scaling-stroke" strokeDasharray="3 7" />
      {/* drawn progress */}
      <motion.path
        ref={ref}
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        style={{ pathLength: progress }}
        className="opacity-60"
      />
      {milestones.map((m) => (
        <Milestone key={m} at={m} progress={progress} pathRef={ref} />
      ))}
      <g ref={headRef} transform="translate(50 0)">
        <circle r="7" fill="var(--accent)" opacity="0.25" />
        <circle r="3" fill="var(--accent)" />
      </g>
    </svg>
  );
}

function Milestone({
  at,
  progress,
  pathRef,
}: {
  at: number;
  progress: MotionValue<number>;
  pathRef: React.RefObject<SVGPathElement | null>;
}) {
  const ref = useRef<SVGGElement>(null);
  const scale = useTransform(progress, [at - 0.02, at], [0.4, 1]);
  const opacity = useTransform(progress, [at - 0.02, at], [0.25, 0.9]);

  useEffect(() => {
    const el = pathRef.current;
    const g = ref.current;
    if (!el || !g) return;
    const pt = el.getPointAtLength(el.getTotalLength() * at);
    g.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
  }, [at, pathRef]);

  return (
    <g ref={ref}>
      <motion.circle r="4" fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" style={{ scale, opacity }} />
    </g>
  );
}
