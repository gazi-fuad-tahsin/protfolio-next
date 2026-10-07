import type { NextRequest } from "next/server";
import { json } from "@/lib/api";
import { projects } from "@/lib/data";

/** GET /api/projects?category=Backend */
export function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");
  const list = projects
    .filter((p) => !category || p.category.toLowerCase() === category.toLowerCase())
    .map(({ slug, title, category, year, role, stack }) => ({ slug, title, category, year, role, stack }));
  return json({ count: list.length, data: list });
}
