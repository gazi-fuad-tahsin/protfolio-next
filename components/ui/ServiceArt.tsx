/** Decorative line-art backdrop for the service detail card, one motif per service icon. */
export function ServiceArt({ name, subtle = false }: { name: string; subtle?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]"
    >
      {/* accent glow + dot grid */}
      <div className={`absolute -top-24 -right-24 h-72 w-72 rounded-full bg-accent blur-3xl ${subtle ? "opacity-10" : "opacity-25"}`} />
      {!subtle && <div className="absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-accent opacity-10 blur-3xl" />}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "18px 18px",
          maskImage: "linear-gradient(to bottom left, black, transparent 70%)",
          WebkitMaskImage:
            "linear-gradient(to bottom left, black, transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 320 240"
        className={`absolute w-auto text-current ${subtle ? "-top-4 -right-10 h-[70%] opacity-[0.08]" : "-right-6 -bottom-6 h-[78%] opacity-[0.13]"}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {motifs[name] ?? motifs.server}
      </svg>
    </div>
  );
}

const motifs: Record<string, React.ReactNode> = {
  // server rack + braces
  server: (
    <>
      {[30, 90, 150].map((y) => (
        <g key={y}>
          <rect x="120" y={y} width="180" height="48" rx="10" />
          <circle cx="146" cy={y + 24} r="5" fill="currentColor" />
          <circle cx="166" cy={y + 24} r="5" />
          <path d={`M200 ${y + 18} h76 M200 ${y + 30} h52`} />
        </g>
      ))}
      <path d="M210 198 v20 M150 218 h120" />
      <path
        d="M70 70 q-20 0 -20 20 v20 q0 14 -14 14 q14 0 14 14 v20 q0 20 20 20"
        strokeWidth={3}
      />
    </>
  ),
  // browser window wireframe
  layout: (
    <>
      <rect x="60" y="30" width="250" height="190" rx="14" />
      <path d="M60 60 h250" />
      <circle cx="80" cy="45" r="4" fill="currentColor" />
      <circle cx="95" cy="45" r="4" />
      <circle cx="110" cy="45" r="4" />
      <rect x="76" y="76" width="60" height="128" rx="8" />
      <rect x="148" y="76" width="146" height="56" rx="8" />
      <path d="M160 168 l24 -16 l24 8 l30 -24 l40 14" strokeWidth={2.5} />
      <path d="M148 196 h146" />
      <path d="M86 96 h40 M86 112 h30 M86 128 h36" />
    </>
  ),
  // card + webhook waves
  plug: (
    <>
      <rect
        x="110"
        y="40"
        width="190"
        height="120"
        rx="16"
        transform="rotate(-8 205 100)"
      />
      <rect
        x="130"
        y="62"
        width="34"
        height="26"
        rx="5"
        transform="rotate(-8 205 100)"
      />
      <path d="M134 128 h120" transform="rotate(-8 205 100)" strokeWidth={3} />
      <path d="M40 210 q30 -30 60 0 t60 0 t60 0 t60 0" />
      <path d="M40 190 q30 -30 60 0 t60 0 t60 0 t60 0" opacity="0.6" />
      <circle cx="70" cy="70" r="22" />
      <path d="M62 70 l6 6 l12 -14" strokeWidth={2.5} />
    </>
  ),
  // CI pipeline + containers
  devops: (
    <>
      {[40, 110, 180, 250].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy="60" r="16" />
          {i < 3 && <path d={`M${x + 16} 60 h38`} />}
          <path d={`M${x - 6} 60 l4 4 l8 -9`} strokeWidth={2.5} />
        </g>
      ))}
      {[0, 1, 2].map((r) =>
        Array.from({ length: 3 - r }, (_, k) => (
          <rect
            key={`${r}-${k}`}
            x={130 + k * 60 + r * 30}
            y={200 - r * 40}
            width="52"
            height="34"
            rx="6"
          />
        )),
      )}
    </>
  ),
  // shield + lock
  security: (
    <>
      <path d="M220 30 l70 26 v54 c0 50 -32 80 -70 98 c-38 -18 -70 -48 -70 -98 v-54 z" />
      <rect x="196" y="110" width="48" height="40" rx="8" />
      <path d="M206 110 v-12 a14 14 0 0 1 28 0 v12" />
      <circle cx="220" cy="128" r="4" fill="currentColor" />
      <path d="M40 80 h60 M40 100 h40 M40 120 h70 M40 140 h50" opacity="0.7" />
    </>
  ),
  // team network
  users: (
    <>
      <circle cx="200" cy="120" r="30" />
      <circle cx="200" cy="112" r="9" />
      <path d="M184 136 q16 -14 32 0" />
      {[
        [110, 50],
        [290, 60],
        [100, 200],
        [300, 200],
        [200, 225],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <path d={`M200 120 L${x} ${y}`} strokeDasharray="4 6" />
          <circle cx={x} cy={y} r="16" fill="var(--ink)" />
          <circle cx={x} cy={y} r="5" fill="currentColor" />
        </g>
      ))}
    </>
  ),
};
