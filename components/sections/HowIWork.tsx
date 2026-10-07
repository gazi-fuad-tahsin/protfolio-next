"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProcessScene } from "@/components/ui/ProcessScenes";
import { Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import { L } from "@/components/ui/L";
import { TechLogo, logoTitle } from "@/components/ui/TechLogo";
import data from "@/data/howiwork.json";

type Step = (typeof data.steps)[number];

/** Scroll so that step `i` sits in the middle of the screen (which also makes it active). */
function goToStep(i: number) {
  document.getElementById(`how-step-${i}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
}

/**
 * Idea → product, as a scroll story. On desktop the illustration is pinned on
 * the left and swaps to match whichever step is in the middle of the screen.
 */
export function HowIWork() {
  const [active, setActive] = useState(0);
  const step = data.steps[active];

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <SectionHeading i18n="how" title={data.heading} intro={data.intro} />
      </Reveal>

      <div className="mt-12 grid gap-10 lg:mt-16 lg:grid-cols-2 lg:gap-16">
        {/* pinned visual (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-[max(6.5rem,calc(50vh-15.25rem))]">
            <SceneCard step={step} index={active} total={data.steps.length} />
          </div>
        </div>

        {/* steps */}
        <ol className="relative">
          {/* connecting rail */}
          <span
            aria-hidden
            className="absolute top-3 bottom-3 left-[19px] w-px bg-line lg:left-[23px]"
          />
          {data.steps.map((s, i) => (
            <StepBlock
              key={s.title}
              step={s}
              index={i}
              active={active === i}
              onActive={setActive}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function SceneCard({
  step,
  index,
  total,
  compact = false,
}: {
  step: Step;
  index: number;
  total: number;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] bg-ink text-ink-fg ${compact ? "p-4" : "p-6"}`}
    >
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent opacity-20 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />
      {!compact && (
        <div className="relative flex items-center justify-between">
          <span className="display text-lg opacity-60">
            <L k="how.step">Step</L> {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <span className="flex items-center">
            {data.steps.map((s, i) => (
              <button
                key={s.title}
                type="button"
                title={s.title}
                aria-label={`Go to step ${i + 1}: ${s.title}`}
                aria-current={i === index ? "step" : undefined}
                onClick={() => goToStep(i)}
                className="group/dot flex h-6 min-w-6 items-center justify-center"
              >
                <span
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-6 bg-accent" : "w-1.5 bg-white/25 group-hover/dot:w-3 group-hover/dot:bg-white/60"}`}
                />
              </button>
            ))}
          </span>
        </div>
      )}
      <div className={`relative ${compact ? "h-[200px]" : "mt-4 h-[360px]"}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step.scene}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <ProcessScene name={step.scene} />
          </motion.div>
        </AnimatePresence>
      </div>
      {!compact && (
        <p className="display relative mt-2 text-center text-2xl">
          <L k={`how.${index}.title`}>{step.title}</L>
        </p>
      )}
    </div>
  );
}

function StepBlock({
  step,
  index,
  active,
  onActive,
}: {
  step: Step;
  index: number;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // "active" when the step crosses the middle band of the viewport
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li
      ref={ref}
      id={`how-step-${index}`}
      className="relative pb-14 pl-14 last:pb-0 lg:flex lg:min-h-[38vh] lg:flex-col lg:justify-center lg:py-6 lg:pl-16"
    >
      <div className="relative">
        {/* rail dot */}
        <span
          className={`display absolute top-0 -left-14 z-10 flex h-10 w-10 items-center justify-center rounded-full border text-base transition-colors duration-500 lg:top-1/2 lg:-left-16 lg:h-12 lg:w-12 lg:-translate-y-1/2 lg:text-lg ${
            active
              ? "border-accent bg-accent text-accent-fg"
              : "border-line bg-bg text-muted"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
          {/* connector to the pinned illustration */}
          <span
            aria-hidden
            className={`absolute top-1/2 right-full mr-1 hidden h-px w-16 -translate-y-1/2 bg-gradient-to-l from-accent to-transparent transition-opacity duration-500 lg:block ${active ? "opacity-100" : "opacity-0"}`}
          />
        </span>

        <div
          className="transition-colors duration-500"
        >
          {/* inline visual on small screens */}
          <div className="mb-5 lg:hidden">
            <SceneCard
              step={step}
              index={index}
              total={data.steps.length}
              compact
            />
          </div>

          <h3 className={`display text-[30px] transition-colors duration-500 md:text-[40px] ${active ? "" : "lg:text-muted"}`}>
            <L k={`how.${index}.title`}>{step.title}</L>
          </h3>
          <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-muted">
            <L k={`how.${index}.desc`}>{step.desc}</L>
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {step.deliverables.map((d, di) => (
              <span
                key={d}
                className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
              >
                <L k={`how.${index}.d.${di}`}>{d}</L>
              </span>
            ))}
          </div>

          {step.tools.length > 0 && (
            <div className="mt-5 flex items-center gap-2">
              {step.tools.map((t) => (
                <span
                  key={t}
                  title={logoTitle(t)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-bg shadow-[0_4px_14px_rgba(0,0,0,0.05)]"
                >
                  <TechLogo name={t} className="h-[18px] w-[18px]" />
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
