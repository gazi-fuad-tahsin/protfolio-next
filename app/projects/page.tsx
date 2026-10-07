import type { Metadata } from "next";
import { ProjectStack } from "@/components/sections/ProjectStack";
import { ProjectGrid } from "@/components/sections/ProjectGrid";
import { Reveal } from "@/components/ui/Motion";
import { L } from "@/components/ui/L";
import { projects } from "@/lib/data";

export const metadata: Metadata = {
  title: "Projects",
  description: "Selected backend, full stack and client platform projects.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  // the grid only needs card fields — keep the long case-study text on the server
  const cards = projects.map((p) => ({ ...p, problem: [], solution: [], challenge: [], summary: [] }));

  return (
    <>
      <section className="container-page pt-36">
        <Reveal>
          <h1 className="display text-[56px] font-bold sm:text-[80px] lg:text-[120px]">
            <L k="projects.title">Featured Projects</L>
          </h1>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">
            <L k="featured.intro">
              Selected work across products and client platforms — secure APIs, real-time systems, payments and full stack apps built for production.
            </L>
          </p>
        </Reveal>
        <ProjectStack projects={cards.filter((p) => p.featured)} />
      </section>

      <section className="container-page py-24">
        <Reveal>
          <h2 className="display text-[42px] font-bold md:text-[56px]">
            <L k="projects.all">All Projects</L>
          </h2>
          <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">
            <L k="projects.allIntro">Filter by category.</L>
          </p>
        </Reveal>
        <ProjectGrid projects={cards} />
      </section>
    </>
  );
}
