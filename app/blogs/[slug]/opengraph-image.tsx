import { ogSize, renderOg } from "@/lib/og";
import { formatDate, getPost, posts } from "@/lib/data";

export const alt = "Engineering note";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  return renderOg({
    eyebrow: p ? `Engineering notes · ${p.category}` : "Engineering notes",
    title: p?.title ?? "Article",
    subtitle: p?.excerpt ?? "",
    tags: p ? [formatDate(p.date), p.readTime] : [],
  });
}
