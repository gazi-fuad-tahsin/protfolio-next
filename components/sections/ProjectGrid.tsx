"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/ui/Cards";
import { L } from "@/components/ui/L";
import type { Project } from "@/lib/data";

/** All projects with category filter chips. Cards animate in/out as the filter changes. */
export function ProjectGrid({ projects }: { projects: Project[] }) {
  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => counts.set(p.category, (counts.get(p.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [projects]);
  const [active, setActive] = useState<string>("All");
  const shown = active === "All" ? projects : projects.filter((p) => p.category === active);

  const chip = (value: string, label: React.ReactNode, count: number) => (
    <button
      key={value}
      type="button"
      aria-pressed={active === value}
      onClick={() => setActive(value)}
      className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition ${
        active === value ? "border-accent bg-accent text-accent-fg" : "border-line text-muted hover:border-accent hover:text-fg"
      }`}
    >
      {label}
      <span className={`text-xs ${active === value ? "opacity-80" : "opacity-60"}`}>{count}</span>
    </button>
  );

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
        {chip("All", <L k="projects.filter.all">All</L>, projects.length)}
        {categories.map(([c, n]) => chip(c, c, n))}
      </div>

      <motion.div layout className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((p) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      {shown.length === 0 && (
        <p className="mt-12 text-muted">
          <L k="projects.none">No projects in this category yet.</L>
        </p>
      )}
    </div>
  );
}
