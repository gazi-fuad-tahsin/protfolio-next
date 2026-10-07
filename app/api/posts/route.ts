import { json } from "@/lib/api";
import { posts } from "@/lib/data";

export function GET() {
  return json({
    count: posts.length,
    data: posts.map(({ slug, title, category, date, readTime }) => ({ slug, title, category, date, readTime })),
  });
}
