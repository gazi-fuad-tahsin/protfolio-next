import type { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { getProject } from "@/lib/data";

/** GET /api/projects/:slug */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/projects/[slug]">) {
  const { slug } = await ctx.params;
  const p = getProject(slug);
  if (!p) return json({ error: "Not found", slug }, { status: 404 });
  const { title, category, year, type, role, stack, excerpt, problem, solution } = p;
  return json({ slug, title, category, year, type, role, stack, excerpt, problem, solution });
}
