import Image from "next/image";
import type { Cover as CoverData } from "@/lib/data";

/**
 * Renders a project/post cover. Uses `cover.image` when set (drop a file in
 * /public and point to it); otherwise draws generated gradient art.
 */
export function Cover({
  cover,
  label,
  className = "",
  sizes = "100vw",
  priority = false,
}: {
  cover: CoverData;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (cover.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={cover.image}
          alt={label ?? ""}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={cover.image.endsWith(".svg")}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ${className}`}
      style={{ background: `radial-gradient(120% 90% at 85% 15%, ${cover.to} 0%, ${cover.from} 70%)` }}
    >
      <svg className="absolute inset-0 h-full w-full text-white" preserveAspectRatio="xMidYMid slice" viewBox="0 0 800 500">
        {cover.pattern === "grid" && (
          <g opacity="0.14" stroke="currentColor" strokeWidth="1">
            {Array.from({ length: 21 }, (_, i) => (
              <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="500" />
            ))}
            {Array.from({ length: 13 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} />
            ))}
          </g>
        )}
        {cover.pattern === "orbit" && (
          <g fill="none" stroke="currentColor" opacity="0.22">
            {[60, 120, 180, 240, 300, 360].map((r) => (
              <circle key={r} cx="620" cy="120" r={r} />
            ))}
            <circle cx="500" cy="210" r="10" fill="currentColor" opacity="0.8" />
            <circle cx="380" cy="60" r="6" fill="currentColor" opacity="0.6" />
          </g>
        )}
        {cover.pattern === "wave" && (
          <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.22">
            {Array.from({ length: 14 }, (_, i) => (
              <path key={i} d={`M0 ${120 + i * 22} C 200 ${40 + i * 22}, 420 ${260 + i * 22}, 800 ${90 + i * 22}`} />
            ))}
          </g>
        )}
        {cover.pattern === "prism" && (
          <g fill="currentColor">
            {Array.from({ length: 9 }, (_, i) => (
              <rect
                key={i}
                x={420 + i * 38}
                y={60 + i * 30}
                width={70}
                height={70}
                rx={6}
                opacity={0.05 + i * 0.03}
                transform={`rotate(35 ${455 + i * 38} ${95 + i * 30})`}
              />
            ))}
          </g>
        )}
      </svg>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}
