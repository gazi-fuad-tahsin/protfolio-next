"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { SceneTheme } from "./JourneyScene";

export type JourneyStation = {
  year: string;
  title: string;
  subtitle: string;
  text: string;
  tags: string[];
  model: string;
  color: string;
  cta?: boolean;
};

// three.js loads only when a 3D section is about to scroll into view
const JourneyScene = dynamic(() => import("./JourneyScene"), {
  ssr: false,
  loading: () => null,
});

function useTheme(): SceneTheme {
  return useSyncExternalStore(
    (cb) => {
      const obs = new MutationObserver(cb);
      obs.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
      return () => obs.disconnect();
    },
    () =>
      document.documentElement.dataset.theme === "dark" ? "dark" : "light",
    () => "light",
  );
}

const noop = () => () => {};
/**
 * WebGL support, probed once per page load. (useSyncExternalStore calls the
 * snapshot on every render — creating a test context each time would exhaust
 * the browser's WebGL contexts, so the result is cached and the probe released.)
 */
let webglSupport: boolean | undefined;
function probeWebGL() {
  if (webglSupport === undefined) {
    try {
      const c = document.createElement("canvas");
      const gl = (c.getContext("webgl2") ||
        c.getContext("webgl")) as WebGLRenderingContext | null;
      webglSupport = !!gl;
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}
function useWebGL() {
  return useSyncExternalStore(noop, probeWebGL, () => true);
}

/** Each scroll segment: hold at the previous stop, glide, hold at the next one. */
function dwell(raw: number, segments: number) {
  const s = Math.min(raw, 0.9999) * segments;
  const i = Math.floor(s);
  const f = s - i;
  const t = Math.min(1, Math.max(0, (f - 0.18) / 0.64));
  return (i + t * t * (3 - 2 * t)) / segments;
}

/**
 * A scroll-pinned About section: heading + milestone card on the left,
 * a 3D scene in a rounded card on the right. The camera moves from model
 * to model as you scroll through the section.
 */
export function JourneySection({
  id,
  heading,
  intro,
  stations,
  hint = "Scroll to explore",
}: {
  id: string;
  heading: ReactNode;
  intro: ReactNode;
  stations: JourneyStation[];
  hint?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const theme = useTheme();
  const webgl = useWebGL();
  // create the WebGL canvas once (when first near) and keep it — re-creating it on every
  // pass would exhaust the browser's WebGL contexts. Off-screen, it simply stops rendering.
  const seen = useInView(ref, { once: true, margin: "60% 0px 60% 0px" });
  const near = useInView(ref, { margin: "15% 0px 15% 0px" });
  const n = stations.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.6,
  });
  const progress = useTransform(smooth, (v) => dwell(v, n));
  const activeIndex = useMotionValue(-1);
  const [active, setActive] = useState(-1);
  const [ready, setReady] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  useMotionValueEvent(progress, "change", (p) => {
    const idx = p * n - 1;
    activeIndex.set(idx);
    const rounded = idx < -0.5 ? -1 : Math.min(n - 1, Math.round(idx));
    if (rounded !== active) setActive(rounded);
  });

  function goTo(i: number) {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const range = el.offsetHeight - window.innerHeight;
    window.scrollTo({
      top: top + ((i + 0.92) / n) * range,
      behavior: "smooth",
    });
  }

  const s = active >= 0 ? stations[active] : null;

  /* no WebGL: a plain, readable timeline */
  if (!webgl) {
    return (
      <section id={id} className="container-page scroll-mt-24 py-24 md:py-32">
        <h2 className="display text-[42px] font-bold md:text-[56px]">
          {heading}
        </h2>
        <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">
          {intro}
        </p>
        <ol className="mt-10 space-y-6">
          {stations.map((st) => (
            <li
              key={st.year + st.title}
              className="border-l-2 pl-5"
              style={{ borderColor: st.color }}
            >
              <p className="display text-xl" style={{ color: st.color }}>
                {st.year}
              </p>
              <p className="display text-2xl">{st.title}</p>
              <p className="mt-1 text-sm text-muted">{st.text}</p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  return (
    <section
      id={id}
      ref={ref}
      className="relative scroll-mt-0"
      style={{ height: `${n * 75 + 100}vh` }}
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-page grid w-full items-center gap-5 pt-20 pb-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:pt-16">
          {/* text column */}
          <div className="order-2 lg:order-1">
            <h2 className="display hidden text-[42px] font-bold lg:block lg:text-[56px]">
              {heading}
            </h2>
            <p className="mt-4 hidden max-w-[460px] text-[15px] leading-relaxed text-muted lg:block">
              {intro}
            </p>

            {/* milestone dots */}
            <div
              className="flex flex-wrap items-center gap-1.5 lg:mt-8"
              aria-label="Milestones"
            >
              {stations.map((st, i) => (
                <button
                  key={st.year + st.title}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`${st.year} — ${st.title}`}
                  aria-current={i === active ? "step" : undefined}
                  className={`display rounded-full border px-2.5 py-1 text-[13px] transition ${
                    i === active
                      ? "border-transparent text-[#0b0b14]"
                      : "border-line text-muted hover:text-fg"
                  }`}
                  style={i === active ? { background: st.color } : undefined}
                >
                  {st.year}
                </button>
              ))}
            </div>

            {/* active milestone card */}
            <div className="relative mt-4 min-h-[190px] lg:mt-6 lg:min-h-[250px]">
              <AnimatePresence mode="wait">
                {s ? (
                  <motion.article
                    key={s.year + s.title}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-[20px] border border-line bg-surface/70 p-5 sm:p-6"
                  >
                    <p className="text-xs text-muted">{s.subtitle}</p>
                    <h3 className="display mt-2 text-[26px] leading-[1.05] sm:text-[32px]">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted sm:text-[14px]">
                      {s.text}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {s.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line bg-bg px-2.5 py-0.5 text-[11px] text-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {s.cta && (
                      <Link
                        href="/#contact"
                        className="display mt-4 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-base text-accent-fg"
                      >
                        Let&apos;s build something →
                      </Link>
                    )}
                  </motion.article>
                ) : (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex h-[190px] items-center gap-2 font-mono text-sm text-muted lg:h-[250px]"
                  >
                    {hint}{" "}
                    <motion.span
                      animate={{ y: [0, 5, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    >
                      ↓
                    </motion.span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* 3D card */}
          <div className="order-1 lg:order-2">
            <h2 className="display mb-3 text-[32px] font-bold lg:hidden">
              {heading}
            </h2>
            <div className="relative h-[40svh] overflow-hidden rounded-[24px] border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.35)] sm:h-[46svh] lg:h-[66svh]">
              {/* skeleton until the first frame is drawn — the card is never an empty white/black box */}
              <div
                aria-hidden
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${ready ? "pointer-events-none opacity-0" : "opacity-100"}`}
                style={{
                  background:
                    theme === "dark"
                      ? "radial-gradient(circle at 50% 60%, #1c1d2b 0%, #0b0b12 70%)"
                      : "radial-gradient(circle at 50% 60%, #ffffff 0%, #ecedf5 70%)",
                }}
              >
                <span className="flex items-center gap-2 font-mono text-xs text-muted">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-line border-t-accent" />
                  Loading 3D…
                </span>
              </div>
              {seen && (
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}
                >
                  <JourneyScene
                    key={canvasKey}
                    stations={stations}
                    progress={progress}
                    activeIndex={activeIndex}
                    narrow
                    theme={theme}
                    paused={!near}
                    onReady={() => setReady(true)}
                    onContextLost={() => {
                      // show the skeleton and rebuild the canvas with a fresh context
                      setReady(false);
                      setTimeout(() => setCanvasKey((k) => k + 1), 300);
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
