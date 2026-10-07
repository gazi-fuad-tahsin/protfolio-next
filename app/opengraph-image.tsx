import { ogSize, renderOg } from "@/lib/og";
import { profile } from "@/lib/data";

export const alt = `${profile.name} — Full Stack Developer & Team Leader`;
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "Portfolio",
    title: "Backend Engineer",
    subtitle: profile.aboutShort,
    tags: ["Node.js", "TypeScript", "Next.js", "MongoDB", "Flutter"],
  });
}
