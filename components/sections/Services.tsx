"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ServiceIcon } from "@/components/ui/Icons";
import { ServiceArt } from "@/components/ui/ServiceArt";
import { L } from "@/components/ui/L";
import { Accordion, Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import servicesData from "@/data/services.json";

const { services, learning } = servicesData;

export function Services() {
  const [active, setActive] = useState(0);
  const s = services[active];

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <SectionHeading
          i18n="services"
          title="What I can do for you"
          intro="As a full stack developer and team leader, I turn product ideas into secure, scalable systems — and lead the teams that ship them."
        />
      </Reveal>

      <div className="mt-12 grid gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
        <Reveal delay={0.1}>
          <Accordion
            defaultOpen={0}
            onChange={setActive}
            items={services.map((svc, si) => ({
              title: <L k={`services.${si}.title`}>{svc.title}</L>,
              content: (
                <ul className="space-y-2">
                  {svc.points.map((p, pi) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      <L k={`services.${si}.points.${pi}`}>{p}</L>
                    </li>
                  ))}
                  <li className="flex flex-wrap gap-2 pt-2 md:hidden">
                    {svc.stack.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-line px-3 py-1 text-xs"
                      >
                        {t}
                      </span>
                    ))}
                  </li>
                </ul>
              ),
            }))}
          />
        </Reveal>

        {/* Detail panel follows the open service */}
        <div className="hidden md:block">
          <div className="sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div
                key={s.title}
                initial={{ opacity: 0, rotateY: -25, y: 20 }}
                animate={{ opacity: 1, rotateY: 0, y: 0 }}
                exit={{ opacity: 0, rotateY: 25, y: -20 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformPerspective: 1000 }}
                className="relative overflow-hidden rounded-[20px] bg-ink p-8 text-ink-fg"
              >
                <ServiceArt name={s.icon} />
                <div className="relative flex items-center justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-fg">
                    <ServiceIcon name={s.icon} className="h-7 w-7" />
                  </span>
                  <span className="display text-5xl opacity-20">
                    0{active + 1}
                  </span>
                </div>
                <h3 className="display relative mt-8 text-[32px]">
                  <L k={`services.${active}.title`}>{s.title}</L>
                </h3>
                <p className="relative mt-3 max-w-[90%] text-[15px] leading-relaxed opacity-70">
                  <L k={`services.${active}.summary`}>{s.summary}</L>
                </p>
                <div className="relative mt-8 flex flex-wrap gap-2">
                  {s.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/20 bg-ink/60 px-3 py-1 text-xs backdrop-blur-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <LearningProgress />
    </section>
  );
}

function LearningProgress() {
  return (
    <div className="mt-20">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="display text-[28px] md:text-[32px]">
              <L k="learning.title">{learning.title}</L>
            </p>
            <p className="mt-2 text-[15px] text-muted">
              <L k="learning.note">{learning.note}</L>
            </p>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-line px-3 py-1 text-xs text-muted">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" /> In
            progress
          </span>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {learning.tracks.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <div className="relative h-full overflow-hidden rounded-[20px] bg-surface p-6">
              <ServiceArt name={i === 0 ? "devops" : "security"} subtle />
              <div className="relative">
                <div className="flex items-baseline justify-between">
                  <h3 className="display text-2xl">
                    <L k={`learning.${i}.name`}>{t.name}</L>
                  </h3>
                  <span className="display text-2xl text-accent">
                    {t.progress}%
                  </span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${t.progress}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.4,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.2,
                    }}
                  />
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {t.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
