import { posts, profile, projects } from "@/lib/data";
import { tBn } from "@/components/ui/L";
import { PaletteClient, type PaletteItem } from "./PaletteClient";

/** Builds a light item list on the server so the client bundle never ships full posts. */
export function CommandPalette() {
  const items: PaletteItem[] = [
    { group: "pages", label: "Home", bn: tBn("nav.home", "Home"), href: "/" },
    { group: "pages", label: "About", bn: tBn("nav.about", "About"), href: "/about" },
    { group: "pages", label: "Projects", bn: tBn("nav.projects", "Projects"), href: "/projects" },
    { group: "pages", label: "Blogs", bn: tBn("nav.blogs", "Blogs"), href: "/blogs" },
    { group: "pages", label: "Contact", bn: tBn("nav.contact", "Contact"), href: "/#contact" },
    ...projects.map((p) => ({ group: "projects" as const, label: p.title, hint: p.category, href: `/projects/${p.slug}` })),
    ...posts.map((p) => ({ group: "posts" as const, label: p.title, hint: p.category, href: `/blogs/${p.slug}` })),
  ];
  return <PaletteClient items={items} email={profile.email} resume={profile.resume} />;
}
