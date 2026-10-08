import { about, learning, posts, profile, projects, services } from "@/lib/data";
import { Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import { TerminalClient, type TerminalData } from "./TerminalClient";

/** Prepares a small, plain snapshot of the data so the client bundle stays light. */
export function AboutTerminal() {
  const data: TerminalData = {
    name: profile.name,
    role: profile.role,
    location: profile.location,
    email: profile.email,
    phone: profile.phone,
    resume: profile.resume,
    available: profile.available,
    bio: profile.aboutLong,
    socials: profile.socials,
    experience: about.experience,
    skills: services.map((s) => ({ group: s.title, items: s.stack })),
    learning: learning.tracks.map((t) => ({ name: t.name, progress: t.progress, items: t.items })),
    projects: projects.map((p) => ({ slug: p.slug, title: p.title, category: p.category, year: p.year })),
    postsCount: posts.length,
  };

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <SectionHeading
          i18n="terminal"
          title="Explore in the terminal"
          intro="Prefer the command line? Type a command — or tap one below — to get to know me the developer way."
        />
      </Reveal>
      <Reveal delay={0.1}>
        <TerminalClient data={data} />
      </Reveal>
    </section>
  );
}
