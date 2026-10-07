import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { profile } from "@/lib/data";

export const ogSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));

/** Shared Open Graph card: dark canvas, accent glow, big Antonio title. */
export async function renderOg({ eyebrow, title, subtitle, tags = [] }: { eyebrow: string; title: string; subtitle: string; tags?: string[] }) {
  const [antonio, inter, interSemi] = await Promise.all([font("Antonio-Bold.ttf"), font("Inter-Regular.ttf"), font("Inter-SemiBold.ttf")]);
  const accent = "#7c82ff";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#17171c",
          backgroundImage: `radial-gradient(circle at 88% 8%, ${accent}66 0%, transparent 45%), radial-gradient(circle at 0% 100%, #e0567a33 0%, transparent 40%)`,
          color: "#f2f2f2",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "#f2f2f2",
              color: "#17171c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Antonio",
              fontSize: 30,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, fontWeight: 600 }}>{profile.name}</span>
            <span style={{ fontSize: 20, color: "#a1a1aa" }}>Team Leader · Full Stack · Backend Engineer</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontSize: 24, fontWeight: 600, color: accent, letterSpacing: 3, textTransform: "uppercase" }}>{eyebrow}</span>
          <span
            style={{
              fontFamily: "Antonio",
              fontSize: title.length > 34 ? 84 : 108,
              lineHeight: 1,
              textTransform: "uppercase",
              marginTop: 14,
              maxWidth: 1050,
            }}
          >
            {title}
          </span>
          <span style={{ fontSize: 28, color: "#c4c4cc", marginTop: 22, maxWidth: 980, lineHeight: 1.35 }}>{subtitle}</span>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {tags.slice(0, 5).map((t) => (
            <span
              key={t}
              style={{ fontSize: 20, padding: "8px 18px", borderRadius: 999, border: "1px solid #3a3a46", color: "#d4d4d8", background: "#ffffff0d" }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Antonio", data: antonio, weight: 700, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
        { name: "Inter", data: interSemi, weight: 600, style: "normal" },
      ],
    },
  );
}
