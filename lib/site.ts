/**
 * Public URL of the site, used for sitemap, robots, canonical and OG links.
 * Set NEXT_PUBLIC_SITE_URL in production (e.g. https://yourname.dev);
 * on Vercel the production domain is picked up automatically.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
