import type { MetadataRoute } from "next";
import { posts, projects } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/projects", "/blogs"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...pages,
    ...projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...posts.map((p) => ({ url: `${siteUrl}/blogs/${p.slug}`, lastModified: p.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
