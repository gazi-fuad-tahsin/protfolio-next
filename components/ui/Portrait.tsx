import Image from "next/image";
import profile from "@/data/profile.json";

/** Profile photo, or a monogram card until `photo` is set in data/profile.json. */
export function Portrait({
  className = "",
  priority = false,
  caption = true,
}: {
  className?: string;
  priority?: boolean;
  caption?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[20px] bg-surface ${className}`}>
      {profile.photo ? (
        <Image src={profile.photo} alt={profile.name} fill priority={priority} sizes="(min-width: 768px) 340px, 80vw" className="object-cover" />
      ) : (
        <div
          className="absolute inset-0 flex items-end justify-end p-6"
          style={{ background: "linear-gradient(160deg, #e9e9ee 0%, #c9cad6 100%)" }}
        >
          <svg className="absolute inset-0 h-full w-full text-[#303030]" viewBox="0 0 340 480" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <g opacity="0.08" stroke="currentColor">
              {Array.from({ length: 12 }, (_, i) => (
                <line key={i} x1={i * 30} y1="0" x2={i * 30} y2="480" />
              ))}
            </g>
            <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill="currentColor" opacity="0.85" style={{ font: "700 150px var(--font-antonio)" }}>
              {profile.initials}
            </text>
          </svg>
          {caption && <span className="relative text-xs tracking-wide text-[#303030]/60">{profile.name}</span>}
        </div>
      )}
    </div>
  );
}

export function Avatar({ size = 32 }: { size?: number }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-ink text-ink-fg display"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {profile.photo ? <Image src={profile.photo} alt="" fill sizes="40px" className="object-cover" /> : profile.initials}
    </span>
  );
}
