import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/ui/Cards";
import { Cover } from "@/components/ui/Cover";
import { Reveal } from "@/components/ui/Motion";
import { Chip, PillAnchor } from "@/components/ui/Primitives";
import { ArrowUpRight, GitHubIcon } from "@/components/ui/Icons";
import { getProject, projects, type Cover as CoverData } from "@/lib/data";
import { L } from "@/components/ui/L";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project
    ? { title: project.title, description: project.excerpt, alternates: { canonical: `/projects/${slug}` } }
    : {};
}

function Block({ title, k, body }: { title: string; k: string; body: string[] }) {
  return (
    <Reveal>
      <h2 className="display text-[28px] md:text-[32px]">
        <L k={k}>{title}</L> :
      </h2>
      {body.map((p) => (
        <p key={p} className="mt-4 text-[15px] leading-relaxed text-muted">
          {p}
        </p>
      ))}
    </Reveal>
  );
}

export default async function ProjectPage(props: PageProps<"/projects/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const { cover } = project;
  const alt = (pattern: CoverData["pattern"], flip = false): CoverData => ({
    image: "",
    from: flip ? cover.to : cover.from,
    to: flip ? cover.from : cover.to,
    pattern,
  });
  const more = projects.filter((p) => p.slug !== project.slug).slice(0, 4);

  const meta = [
    { k: "Year", i: "project.year", v: project.year },
    { k: "Type", i: "project.type", v: project.type },
    { k: "Role", i: "project.role", v: project.role },
    { k: "Context", i: "project.context", v: project.duration },
  ];

  return (
    <>
      <article className="mx-auto max-w-[1000px] px-4 pt-36 md:px-10">
        <Reveal>
          <Chip>{project.category}</Chip>
          <h1 className="display mt-4 text-[44px] font-bold sm:text-[64px] lg:text-[88px]">{project.title}</h1>
          <p className="mt-4 max-w-[720px] text-[15px] leading-relaxed text-muted">{project.excerpt}</p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {meta.map((m) => (
            <div key={m.k}>
              <p className="text-sm">
                <L k={m.i}>{m.k}</L> :
              </p>
              <p className="mt-1 text-sm font-semibold text-accent">{m.v}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.15} className="mt-8 flex flex-wrap items-center gap-2">
          {project.stack.map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
              {t}
            </span>
          ))}
        </Reveal>

        {(project.github || project.live) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.live && (
              <PillAnchor href={project.live} target="_blank" rel="noreferrer">
                <L k="project.live">Live Site</L> <ArrowUpRight className="h-4 w-4" />
              </PillAnchor>
            )}
            {project.github && (
              <PillAnchor href={project.github} target="_blank" rel="noreferrer">
                <L k="project.source">Source</L> <GitHubIcon className="h-4 w-4" />
              </PillAnchor>
            )}
          </div>
        )}

        <Reveal delay={0.2}>
          <Cover cover={cover} label={project.title} priority className="mt-12 aspect-[16/9] rounded-[20px]" />
        </Reveal>

        <div className="mt-16 space-y-14">
          <Block title="Problem" k="project.problem" body={project.problem} />
          <Reveal>
            <Cover cover={alt("wave", true)} className="aspect-[21/9] rounded-[20px]" />
          </Reveal>
          <Block title="Solution" k="project.solution" body={project.solution} />
          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal>
              <Cover cover={alt("orbit")} className="aspect-square rounded-[20px]" />
            </Reveal>
            <Reveal delay={0.1}>
              <Cover cover={alt("prism", true)} className="aspect-square rounded-[20px]" />
            </Reveal>
          </div>
          <Block title="Challenge" k="project.challenge" body={project.challenge} />
          <Block title="Summary" k="project.summary" body={project.summary} />
        </div>
      </article>

      <section className="container-page py-24 md:py-32">
        <Reveal>
          <h2 className="display text-[42px] font-bold md:text-[56px]">
            <L k="projects.more">More Projects</L>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-x-6 gap-y-14 md:grid-cols-2">
          {more.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.1}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
