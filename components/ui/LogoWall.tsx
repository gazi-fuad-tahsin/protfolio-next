import { TechLogo, logoTitle } from "./TechLogo";

const columns = [
  ["nodedotjs", "typescript", "react", "mongodb", "stripe", "docker", "python", "git", "codeforces", "tailwindcss"],
  ["express", "nextdotjs", "flutter", "firebase", "socketdotio", "javascript", "cplusplus", "postman", "kubernetes", "resend"],
  ["mysql", "dart", "jwt", "revenuecat", "cloudflare", "php", "java", "githubactions", "cloudinary", "codechef"],
];

/** Card of tech logos scrolling in three columns (alternating directions). */
export function LogoWall({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[20px] bg-surface ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
      }}
    >
      <div className="grid h-full grid-cols-3 gap-3 px-4">
        {columns.map((col, c) => (
          <div key={c} className="relative overflow-hidden">
            <div
              className="logo-marquee flex flex-col gap-3"
              style={{ animationDuration: `${28 + c * 6}s`, animationDirection: c % 2 ? "reverse" : "normal" }}
            >
              {[...col, ...col].map((name, i) => (
                <div
                  key={i}
                  aria-hidden={i >= col.length}
                  title={logoTitle(name)}
                  className="flex aspect-square items-center justify-center rounded-2xl border border-line bg-bg shadow-[0_4px_14px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:scale-105"
                >
                  <TechLogo name={name} className="h-9 w-9" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
