"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { CountUp, Reveal } from "@/components/ui/Motion";
import { Portrait } from "@/components/ui/Portrait";
import { PillAnchor, PillLink, Socials } from "@/components/ui/Primitives";
import { DownloadIcon } from "@/components/ui/Icons";
import profile from "@/data/profile.json";
import { L } from "@/components/ui/L";

export function AboutIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [70, -8]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [10, 3]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [0, 1]);

  return (
    <section ref={ref} className="container-page grid items-center gap-12 py-24 md:grid-cols-2">
      <div>
        <Reveal>
          <h2 className="display text-[42px] font-bold md:text-[56px]">
            <L k="aboutIntro.heading">About me</L>
          </h2>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">
            <L k="aboutIntro.text">{profile.aboutShort}</L>
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid grid-cols-3 gap-4 sm:flex sm:gap-10">
          {profile.stats.map((s, i) => (
            <div key={s.label}>
              <CountUp value={s.value} suffix={s.suffix} className="display text-[40px] text-accent sm:text-[48px]" />
              <p className="text-xs sm:text-sm">
                <L k={`stats.${i}`}>{s.label}</L>
              </p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-8 grid max-w-[420px] grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold">
              <L k="aboutIntro.call">Call Today :</L>
            </p>
            <a href={`tel:${profile.phone}`} className="text-muted">
              {profile.phone}
            </a>
          </div>
          <div>
            <p className="font-semibold">
              <L k="aboutIntro.email">Email :</L>
            </p>
            <a href={`mailto:${profile.email}`} className="break-all text-muted">
              {profile.email}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Socials className="mt-8" />
          <div className="mt-8 flex flex-wrap gap-3">
            <PillLink href="/about">
              <L k="aboutIntro.story">My Story</L>
            </PillLink>
            <PillAnchor href={profile.resume} download>
              <L k="nav.downloadCv">Download CV</L> <DownloadIcon className="h-4 w-4" />
            </PillAnchor>
          </div>
        </Reveal>
      </div>

      <motion.div style={{ rotateY, rotateZ, opacity, transformPerspective: 1200 }} className="mx-auto md:mr-0">
        <Portrait className="h-[340px] w-[250px] shadow-2xl sm:h-[420px] sm:w-[300px] md:h-[480px] md:w-[340px]" />
      </motion.div>
    </section>
  );
}
