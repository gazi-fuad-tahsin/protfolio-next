import type { TerminalData } from "@/components/sections/TerminalClient";
import { about, learning, posts, profile, projects, services } from "@/lib/data";

/** A small, plain snapshot for the terminal so the client bundle stays light. */
export function getTerminalData(): TerminalData {
  return {
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
}
