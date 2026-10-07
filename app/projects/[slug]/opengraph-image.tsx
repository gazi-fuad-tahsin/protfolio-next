import { ogSize, renderOg } from "@/lib/og";
import { getProject, projects } from "@/lib/data";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return renderOg({
    eyebrow: p ? `Case study · ${p.category}` : "Project",
    title: p?.title ?? "Project",
    subtitle: p?.excerpt ?? "",
    tags: p?.stack ?? [],
  });
}
