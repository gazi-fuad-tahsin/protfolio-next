"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { Cover } from "@/components/ui/Cover";
import { ArrowUpRight } from "@/components/ui/Icons";
import { Chip } from "@/components/ui/Primitives";
import { L } from "@/components/ui/L";
import type { Project } from "@/lib/data";

const smooth = "duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]";

/** Featured projects as sticky cards that stack on top of each other while scrolling. */
export function ProjectStack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative mt-6">
      {projects.map((p, i) => (
        <StackCard key={p.slug} project={p} index={i} total={projects.length} progress={scrollYProgress} />
      ))}
      {/* Hold: the full stack stays pinned while this spacer scrolls past */}
      <div aria-hidden className="h-[35vh]" />
    </div>
  );
}

function StackCard({
  project,
  index,
  total,
  progress,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - index - 1) * 0.05;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);
  const offset = index * 16; // each card sits a little lower so the previous one peeks out

  return (
    // Wrapper height ≈ top padding + card height + small gap, so the next card arrives quickly
    <div
      className="sticky top-0 [--h:520px] md:[--h:640px]"
      style={{ height: `calc(var(--h) + ${offset}px)`, paddingTop: 96 + offset }}
    >
      <motion.div style={{ scale }} className="w-full origin-top">
        <Link
          href={`/projects/${project.slug}`}
          className="group relative block h-[400px] overflow-hidden rounded-[20px] bg-ink shadow-[0_-12px_40px_rgba(0,0,0,0.12)] md:h-[520px]"
        >
          <div className={`absolute inset-0 transition-transform ${smooth} group-hover:scale-[1.06]`}>
            <Cover cover={project.cover} label={project.title} className="h-full w-full" />
          </div>
          <div className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/40 md:from-black/80 md:via-black/50 md:to-black/30 transition-opacity ${smooth} group-hover:opacity-90`} />

          <div
            className={`relative flex h-full flex-col items-center justify-center px-6 text-center text-white transition-transform ${smooth} group-hover:-translate-y-2`}
          >
            <Chip solid>{project.category}</Chip>
            <h3 className="display mt-4 text-[34px] leading-[0.95] font-bold sm:text-[44px] md:text-[64px]">{project.title}</h3>
            <p className="mt-3 line-clamp-2 max-w-[560px] text-sm leading-relaxed text-white/85 md:line-clamp-none">{project.excerpt}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {project.stack.slice(0, 5).map((t, i) => (
                <span key={t} className={`rounded-full border border-white/30 px-3 py-1 text-xs text-white/90 backdrop-blur-sm ${i > 2 ? "hidden sm:inline" : ""}`}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow that grows into a "View Project" pill on hover */}
          <span
            className={`absolute right-5 bottom-5 flex h-12 items-center overflow-hidden rounded-full border border-white/25 bg-white/10 px-3.5 text-white backdrop-blur-md transition-all ${smooth} group-hover:border-transparent group-hover:bg-accent group-hover:pl-5 group-hover:text-accent-fg md:right-6 md:bottom-6`}
          >
            <span className={`display max-w-0 overflow-hidden text-lg whitespace-nowrap opacity-0 transition-all ${smooth} group-hover:mr-2 group-hover:max-w-[140px] group-hover:opacity-100`}>
              <L k="project.view">View Project</L>
            </span>
            <ArrowUpRight className={`h-5 w-5 shrink-0 transition-transform ${smooth} group-hover:rotate-45`} />
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
