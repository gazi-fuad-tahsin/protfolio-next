"use client";

import { motion } from "motion/react";
import { createContext, useContext, useId, type ReactNode } from "react";

/**
 * Looping illustrations for the "How I Work" steps, drawn on a 400×300 canvas.
 * Shared visual language: glass panels, accent glows, light beams with
 * travelling packets, and a slow orbit ring behind each hero object.
 */

const A = "var(--accent)";
const W = "#ffffff";
const loop = { repeat: Infinity, ease: "easeInOut" } as const;
const linear = { repeat: Infinity, ease: "linear" } as const;
const FONT = "var(--font-inter), system-ui, sans-serif";

/** Unique id prefix per SVG, so gradients/filters never resolve into a hidden copy. */
const IdCtx = createContext("ps");
const useU = () => {
  const p = useContext(IdCtx);
  return (name: string) => `url(#${p}-${name})`;
};

export function ProcessScene({ name }: { name: string }) {
  const Scene = scenes[name] ?? IdeaScene;
  const prefix = "ps" + useId().replace(/[^a-zA-Z0-9]/g, "");
  return (
    <IdCtx.Provider value={prefix}>
      <svg
        viewBox="0 0 400 300"
        className="h-full w-full"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Defs />
        <Orbit />
        <Scene />
      </svg>
    </IdCtx.Provider>
  );
}

/* ------------------------------------------------------------ primitives */

function Defs() {
  const p = useContext(IdCtx);
  return (
    <defs>
      <radialGradient id={`${p}-glow`}>
        <stop offset="0" stopColor={A} stopOpacity="0.55" />
        <stop offset="1" stopColor={A} stopOpacity="0" />
      </radialGradient>
      <linearGradient id={`${p}-glass`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={W} stopOpacity="0.14" />
        <stop offset="1" stopColor={W} stopOpacity="0.04" />
      </linearGradient>
      <linearGradient id={`${p}-accent`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={A} />
        <stop offset="1" stopColor={A} stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={`${p}-beam`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor={A} stopOpacity="0" />
        <stop offset="0.5" stopColor={A} />
        <stop offset="1" stopColor={A} stopOpacity="0" />
      </linearGradient>
      <filter id={`${p}-shadow`} x="-30%" y="-30%" width="160%" height="170%">
        <feDropShadow
          dx="0"
          dy="8"
          stdDeviation="8"
          floodColor="#000"
          floodOpacity="0.45"
        />
      </filter>
      <filter id={`${p}-blur`} x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
  );
}

/** Slow dashed orbit + soft glow behind every scene. */
function Orbit() {
  const u = useU();
  return (
    <g>
      <circle cx="200" cy="150" r="120" fill={u("glow")} opacity="0.5" />
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ ...linear, duration: 40 }}
      >
        <circle
          cx="200"
          cy="150"
          r="128"
          stroke={W}
          strokeOpacity="0.08"
          strokeDasharray="2 8"
        />
        <circle cx="328" cy="150" r="3" fill={A} />
      </motion.g>
      <circle cx="200" cy="150" r="92" stroke={W} strokeOpacity="0.05" />
    </g>
  );
}

function Glass({
  x,
  y,
  w,
  h,
  r = 12,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  r?: number;
  children?: ReactNode;
}) {
  const u = useU();
  return (
    <g filter={u("shadow")}>
      <rect x={x} y={y} width={w} height={h} rx={r} fill="#1a1b24" />
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill={u("glass")}
        stroke={W}
        strokeOpacity="0.14"
      />
      <rect
        x={x + 1}
        y={y + 1}
        width={w - 2}
        height={Math.min(18, h / 3)}
        rx={r - 1}
        fill={W}
        opacity="0.03"
      />
      {children}
    </g>
  );
}

/** A connection line with a light pulse travelling along it. */
function Beam({
  d,
  delay = 0,
  duration = 2.2,
}: {
  d: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <g>
      <path d={d} stroke={W} strokeOpacity="0.12" strokeWidth="1.5" />
      <motion.path
        d={d}
        stroke={A}
        strokeWidth="2.5"
        strokeDasharray="14 200"
        animate={{ strokeDashoffset: [214, 0] }}
        transition={{ ...linear, duration, delay }}
      />
    </g>
  );
}

function Label({
  x,
  y,
  children,
  size = 11,
  opacity = 0.85,
  anchor = "start",
  weight = 600,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  opacity?: number;
  anchor?: "start" | "middle" | "end";
  weight?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontWeight={weight}
      fill={W}
      opacity={opacity}
      textAnchor={anchor}
      fontFamily={FONT}
    >
      {children}
    </text>
  );
}

function Bar({
  x,
  y,
  w,
  o = 0.25,
  h = 5,
}: {
  x: number;
  y: number;
  w: number;
  o?: number;
  h?: number;
}) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={W} opacity={o} />
  );
}

/* ---------------------------------------------------------------- scenes */

/* 1 — Idea: a lit bulb with goal / users / scope chips in orbit */
function IdeaScene() {
  const u = useU();
  const chips = [
    { x: 40, y: 70, t: "Goal", c: "#ffd166" },
    { x: 290, y: 60, t: "Users", c: "#ff8fab" },
    { x: 280, y: 200, t: "Scope", c: "#5eead4" },
    { x: 46, y: 196, t: "Timeline", c: "#a5b4fc" },
  ];
  return (
    <g>
      {chips.map((c, i) => (
        <g key={c.t}>
          <Beam
            d={`M200 140 L${c.x + 38} ${c.y + 17}`}
            delay={i * 0.5}
            duration={2.6}
          />
          <motion.g
            animate={{ y: [0, -5, 0] }}
            transition={{ ...loop, duration: 3 + i * 0.4, delay: i * 0.3 }}
          >
            <Glass x={c.x} y={c.y} w={c.t.length > 6 ? 86 : 76} h={34} r={17}>
              <circle cx={c.x + 18} cy={c.y + 17} r="6" fill={c.c} />
              <Label x={c.x + 30} y={c.y + 21} size={12}>
                {c.t}
              </Label>
            </Glass>
          </motion.g>
        </g>
      ))}
      {/* pulse rings */}
      {[0, 1].map((i) => (
        <motion.circle
          key={i}
          cx="200"
          cy="130"
          r="40"
          stroke={A}
          strokeWidth="2"
          animate={{ r: [40, 80], opacity: [0.6, 0] }}
          transition={{ ...linear, duration: 2.4, delay: i * 1.2 }}
        />
      ))}
      {/* bulb */}
      <motion.circle
        cx="200"
        cy="128"
        r="46"
        fill={A}
        filter={u("blur")}
        animate={{ opacity: [0.35, 0.75, 0.35] }}
        transition={{ ...loop, duration: 2.4 }}
      />
      <path
        d="M200 86 a42 42 0 0 1 25 76 v12 h-50 v-12 a42 42 0 0 1 25 -76z"
        fill={u("accent")}
        stroke={W}
        strokeOpacity="0.6"
        strokeWidth="2"
      />
      <path
        d="M182 108 a24 24 0 0 1 16 -10"
        stroke={W}
        strokeOpacity="0.7"
        strokeWidth="4"
      />
      <motion.path
        d="M188 160 l6 -22 l6 10 l6 -10 l6 22"
        stroke={W}
        strokeWidth="2.5"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ ...loop, duration: 1.2 }}
      />
      <rect x="178" y="176" width="44" height="8" rx="4" fill="#cfd2dc" />
      <rect x="182" y="187" width="36" height="8" rx="4" fill="#9ea2b0" />
      <rect x="190" y="198" width="20" height="6" rx="3" fill="#6b7080" />
    </g>
  );
}

/* 2 — Research: glass analytics dashboard with a self-drawing chart and lens */
function ResearchScene() {
  const line =
    "M70 190 C 95 170, 110 185, 130 160 S 170 120, 190 135 S 225 95, 250 80";
  return (
    <g>
      <Glass x={50} y={52} w={220} h={170} r={16}>
        <Label x={66} y={74} size={11} opacity={0.6}>
          User insights
        </Label>
        <Bar x={66} y={82} w={60} o={0.15} />
        {/* grid */}
        {[110, 140, 170, 200].map((y) => (
          <line
            key={y}
            x1="66"
            y1={y}
            x2="256"
            y2={y}
            stroke={W}
            strokeOpacity="0.06"
          />
        ))}
        <path d={`${line} L250 205 L70 205 Z`} fill={A} opacity="0.12" />
        <motion.path
          d={line}
          stroke={A}
          strokeWidth="3"
          animate={{ pathLength: [0, 1, 1] }}
          transition={{ ...loop, duration: 3.6, times: [0, 0.6, 1] }}
        />
        <motion.circle
          cx="250"
          cy="80"
          r="5"
          fill={W}
          stroke={A}
          strokeWidth="3"
          animate={{ scale: [0, 0, 1, 1] }}
          transition={{ ...loop, duration: 3.6, times: [0, 0.55, 0.65, 1] }}
        />
      </Glass>
      {/* donut */}
      <Glass x={286} y={52} w={84} h={84} r={16}>
        <circle
          cx="328"
          cy="94"
          r="24"
          stroke={W}
          strokeOpacity="0.12"
          strokeWidth="8"
        />
        <motion.circle
          cx="328"
          cy="94"
          r="24"
          stroke={A}
          strokeWidth="8"
          strokeDasharray="100 151"
          animate={{ rotate: 360 }}
          transition={{ ...linear, duration: 6 }}
        />
      </Glass>
      {/* persona */}
      <Glass x={286} y={146} w={84} h={76} r={16}>
        <circle cx="306" cy="168" r="10" fill="#ff8fab" />
        <Bar x={322} y={163} w={36} o={0.5} />
        <Bar x={322} y={172} w={24} o={0.2} />
        <Bar x={300} y={194} w={58} o={0.18} />
        <Bar x={300} y={204} w={40} o={0.18} />
      </Glass>
      {/* lens */}
      <motion.g
        animate={{ x: [0, 70, 130, 0], y: [0, -20, -50, 0] }}
        transition={{ ...loop, duration: 7 }}
      >
        <circle
          cx="120"
          cy="170"
          r="28"
          fill={A}
          fillOpacity="0.12"
          stroke={W}
          strokeWidth="4"
        />
        <path
          d="M106 160 a16 16 0 0 1 10 -8"
          stroke={W}
          strokeOpacity="0.7"
          strokeWidth="3"
        />
        <line x1="140" y1="190" x2="158" y2="208" stroke={W} strokeWidth="7" />
      </motion.g>
    </g>
  );
}

/* 3 — Design: Figma-like canvas with selection handles and live cursors */
function DesignScene() {
  const u = useU();
  return (
    <g>
      {/* layers panel */}
      <Glass x={30} y={60} w={70} h={180} r={14}>
        <Label x={42} y={80} size={9} opacity={0.5}>
          LAYERS
        </Label>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i}>
            <rect
              x="40"
              y={92 + i * 26}
              width="50"
              height="18"
              rx="5"
              fill={i === 1 ? A : W}
              opacity={i === 1 ? 0.35 : 0.05}
            />
            <Bar
              x={48}
              y={98 + i * 26}
              w={i % 2 ? 26 : 34}
              o={i === 1 ? 0.9 : 0.35}
            />
          </g>
        ))}
      </Glass>
      {/* phone artboard */}
      <Glass x={140} y={40} w={120} h={220} r={22}>
        <rect
          x="180"
          y="50"
          width="40"
          height="6"
          rx="3"
          fill={W}
          opacity="0.25"
        />
        <rect
          x="152"
          y="68"
          width="96"
          height="62"
          rx="10"
          fill={u("accent")}
        />
        <circle cx="172" cy="88" r="8" fill={W} opacity="0.8" />
        <Bar x={152} y={142} w={70} o={0.5} h={7} />
        <Bar x={152} y={156} w={92} o={0.18} />
        <Bar x={152} y={166} w={80} o={0.18} />
        <rect
          x="152"
          y="182"
          width="44"
          height="40"
          rx="8"
          fill={W}
          opacity="0.08"
        />
        <rect
          x="204"
          y="182"
          width="44"
          height="40"
          rx="8"
          fill={W}
          opacity="0.08"
        />
        <motion.rect
          x="152"
          y="230"
          width="96"
          height="20"
          rx="10"
          fill={A}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ ...loop, duration: 1.6 }}
        />
      </Glass>
      {/* selection */}
      <motion.g
        animate={{ opacity: [0, 1, 1, 0] }}
        transition={{ ...loop, duration: 4, times: [0, 0.2, 0.8, 1] }}
      >
        <rect
          x="148"
          y="64"
          width="104"
          height="70"
          stroke={A}
          strokeWidth="1.5"
        />
        {[
          [148, 64],
          [252, 64],
          [148, 134],
          [252, 134],
        ].map(([x, y]) => (
          <rect
            key={`${x}${y}`}
            x={x - 3.5}
            y={y - 3.5}
            width="7"
            height="7"
            fill={W}
            stroke={A}
            strokeWidth="1.5"
          />
        ))}
        <rect x="186" y="138" width="28" height="13" rx="3" fill={A} />
        <Label
          x={200}
          y={148}
          size={8}
          anchor="middle"
          weight={700}
          opacity={1}
        >
          104
        </Label>
      </motion.g>
      {/* tokens */}
      <Glass x={296} y={70} w={74} h={100} r={14}>
        {[A, "#ff8fab", "#ffd166", "#5eead4"].map((c, i) => (
          <circle
            key={i}
            cx={316 + (i % 2) * 34}
            cy={96 + Math.floor(i / 2) * 34}
            r="11"
            fill={c}
          />
        ))}
        <Bar x={308} y={152} w={50} o={0.2} />
      </Glass>
      {/* cursors */}
      <motion.g
        animate={{ x: [0, 30, -10, 0], y: [0, 30, 60, 0] }}
        transition={{ ...loop, duration: 5 }}
      >
        <path d="M250 150 l0 22 l6 -6 l5 10 l4 -2 l-5 -10 l8 0 z" fill={W} />
        <rect x="262" y="172" width="30" height="14" rx="7" fill={A} />
        <Label
          x={277}
          y={182}
          size={8}
          anchor="middle"
          weight={700}
          opacity={1}
        >
          You
        </Label>
      </motion.g>
      <motion.g
        animate={{ x: [0, -40, -20, 0], y: [0, -20, 20, 0] }}
        transition={{ ...loop, duration: 6, delay: 1 }}
      >
        <path
          d="M118 210 l0 22 l6 -6 l5 10 l4 -2 l-5 -10 l8 0 z"
          fill="#ff8fab"
        />
        <rect x="130" y="232" width="38" height="14" rx="7" fill="#ff8fab" />
        <Label
          x={149}
          y={242}
          size={8}
          anchor="middle"
          weight={700}
          opacity={1}
        >
          Client
        </Label>
      </motion.g>
    </g>
  );
}

/* 4 — Backend: server rack, gateway, database & cache with live traffic */
function BackendScene() {
  const u = useU();
  return (
    <g>
      {/* traffic */}
      <Beam d="M78 92 C 120 92, 130 140, 168 140" delay={0} />
      <Beam d="M78 208 C 120 208, 130 160, 168 160" delay={0.6} />
      <Beam d="M232 140 C 270 140, 270 88, 300 88" delay={0.3} />
      <Beam d="M232 160 C 270 160, 270 212, 300 212" delay={0.9} />
      <Beam d="M200 186 L200 232" delay={1.2} duration={1.6} />

      {/* clients */}
      <Glass x={26} y={70} w={52} h={44} r={10}>
        <rect
          x="34"
          y="78"
          width="36"
          height="22"
          rx="3"
          fill={A}
          opacity="0.5"
        />
        <rect
          x="44"
          y="104"
          width="16"
          height="4"
          rx="2"
          fill={W}
          opacity="0.3"
        />
      </Glass>
      <Label x={52} y={128} size={9} anchor="middle" opacity={0.55}>
        Web
      </Label>
      <Glass x={36} y={180} w={32} h={56} r={8}>
        <rect
          x="41"
          y="188"
          width="22"
          height="34"
          rx="3"
          fill={A}
          opacity="0.5"
        />
        <circle cx="52" cy="228" r="2.5" fill={W} opacity="0.4" />
      </Glass>
      <Label x={52} y={250} size={9} anchor="middle" opacity={0.55}>
        Mobile
      </Label>

      {/* server rack */}
      <motion.circle
        cx="200"
        cy="150"
        r="50"
        fill={A}
        filter={u("blur")}
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ ...loop, duration: 2.4 }}
      />
      <Glass x={162} y={100} w={76} h={90} r={10}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect
              x="170"
              y={110 + i * 26}
              width="60"
              height="20"
              rx="4"
              fill="#0f1016"
              stroke={W}
              strokeOpacity="0.1"
            />
            {[0, 1].map((k) => (
              <motion.circle
                key={k}
                cx={180 + k * 9}
                cy={120 + i * 26}
                r="2.5"
                fill={k ? "#22c55e" : A}
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ ...linear, duration: 0.6 + ((i + k) % 3) * 0.35 }}
              />
            ))}
            <Bar x={198} y={118 + i * 26} w={24} o={0.25} h={4} />
          </g>
        ))}
      </Glass>
      <Label
        x={200}
        y={92}
        size={10}
        anchor="middle"
        opacity={0.75}
        weight={700}
      >
        API Gateway
      </Label>

      {/* services */}
      <Glass x={300} y={66} w={76} h={44} r={10}>
        <circle cx="318" cy="88" r="9" fill="#ffd166" opacity="0.9" />
        <Label x={332} y={92} size={11}>
          Auth
        </Label>
      </Glass>
      <Glass x={300} y={190} w={76} h={44} r={10}>
        <path
          d="M312 204 l8 -6 l8 6 v10 l-8 6 l-8 -6z"
          fill="#ff8fab"
          opacity="0.9"
        />
        <Label x={334} y={216} size={11}>
          Cache
        </Label>
      </Glass>

      {/* database */}
      <g filter={u("shadow")}>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path
              d={`M178 ${238 + i * 12} v10 a22 7 0 0 0 44 0 v-10`}
              fill={i === 0 ? "#2f8f5b" : "#24704a"}
            />
            <ellipse
              cx="200"
              cy={238 + i * 12}
              rx="22"
              ry="7"
              fill={i === 0 ? "#47a248" : "#2f8f5b"}
            />
          </g>
        ))}
      </g>
      <Label x={232} y={262} size={9} opacity={0.55}>
        Database
      </Label>
    </g>
  );
}

/* 5 — Build: code compiles into a laptop + phone app */
function BuildScene() {
  const u = useU();
  const code = [
    { w: 70, c: "#c084fc" },
    { w: 110, c: "#60a5fa" },
    { w: 90, c: W },
    { w: 120, c: "#86efac" },
    { w: 60, c: "#fbbf24" },
  ];
  return (
    <g>
      {/* code window */}
      <Glass x={40} y={36} w={170} h={110} r={12}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <circle key={c} cx={54 + i * 11} cy="50" r="3.5" fill={c} />
        ))}
        {code.map((l, i) => (
          <motion.rect
            key={i}
            x={54 + (i % 2) * 10}
            y={66 + i * 14}
            height="6"
            rx="3"
            fill={l.c}
            opacity="0.75"
            animate={{ width: [0, l.w, l.w, 0] }}
            transition={{
              ...loop,
              duration: 4.5,
              times: [0, 0.2, 0.85, 1],
              delay: i * 0.18,
            }}
          />
        ))}
      </Glass>

      <Beam d="M210 92 C 250 92, 250 140, 250 150" duration={1.8} />

      {/* laptop */}
      <Glass x={110} y={150} w={190} h={110} r={10}>
        <rect x="120" y="160" width="170" height="90" rx="6" fill="#0f1016" />
        <rect
          x="128"
          y="168"
          width="40"
          height="74"
          rx="5"
          fill={W}
          opacity="0.06"
        />
        <motion.rect
          x="176"
          y="168"
          width="106"
          height="36"
          rx="6"
          fill={u("accent")}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ ...loop, duration: 4.5, times: [0.2, 0.35, 0.85, 1] }}
        />
        {[0, 1].map((i) => (
          <motion.rect
            key={i}
            x={176 + i * 55}
            y="210"
            width="51"
            height="32"
            rx="6"
            fill={W}
            opacity="0.1"
            animate={{ opacity: [0, 0.12, 0.12, 0] }}
            transition={{ ...loop, duration: 4.5, times: [0.3, 0.45, 0.85, 1] }}
          />
        ))}
      </Glass>
      <path d="M96 262 h218 l-12 10 h-194 z" fill="#3a3c48" />

      {/* phone */}
      <motion.g
        animate={{ y: [0, -6, 0] }}
        transition={{ ...loop, duration: 3 }}
      >
        <Glass x={300} y={100} w={72} h={140} r={16}>
          <rect
            x="308"
            y="110"
            width="56"
            height="120"
            rx="10"
            fill="#0f1016"
          />
          <rect
            x="324"
            y="114"
            width="24"
            height="5"
            rx="2.5"
            fill={W}
            opacity="0.2"
          />
          <rect
            x="314"
            y="126"
            width="44"
            height="36"
            rx="7"
            fill={u("accent")}
          />
          <Bar x={314} y={170} w={36} o={0.5} />
          <Bar x={314} y={180} w={44} o={0.15} />
          <rect
            x="314"
            y="194"
            width="44"
            height="14"
            rx="7"
            fill={A}
            opacity="0.9"
          />
        </Glass>
      </motion.g>

      {/* build bar */}
      <Glass x={230} y={40} w={140} h={44} r={12}>
        <Label x={244} y={58} size={10} opacity={0.7}>
          Building app…
        </Label>
        <rect
          x="244"
          y="66"
          width="112"
          height="6"
          rx="3"
          fill={W}
          opacity="0.1"
        />
        <motion.rect
          x="244"
          y="66"
          height="6"
          rx="3"
          fill={A}
          animate={{ width: [0, 112, 112] }}
          transition={{ ...loop, duration: 4.5, times: [0, 0.7, 1] }}
        />
      </Glass>
    </g>
  );
}

/* 6 — Launch: rocket lifts off; terminal confirms the deploy is live */
function LaunchScene() {
  const u = useU();
  return (
    <g>
      {/* terminal */}
      <Glass x={30} y={70} w={150} h={130} r={14}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
          <circle key={c} cx={46 + i * 11} cy="86" r="3.5" fill={c} />
        ))}
        {["Tests passed", "Build ready", "Deployed"].map((t, i) => (
          <motion.g
            key={t}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{
              ...loop,
              duration: 4,
              times: [0, 0.12, 0.9, 1],
              delay: i * 0.5,
            }}
          >
            <circle cx="50" cy={110 + i * 22} r="6" fill="#22c55e" />
            <path
              d={`M47 ${110 + i * 22} l2 2 l4 -4`}
              stroke={W}
              strokeWidth="1.8"
            />
            <Label x={62} y={114 + i * 22} size={11}>
              {t}
            </Label>
          </motion.g>
        ))}
        <rect
          x="44"
          y="172"
          width="58"
          height="18"
          rx="9"
          fill="#22c55e"
          opacity="0.18"
        />
        <motion.circle
          cx="54"
          cy="181"
          r="3.5"
          fill="#22c55e"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ ...loop, duration: 1.2 }}
        />
        <Label x={62} y={185} size={10} weight={700} opacity={1}>
          Live
        </Label>
      </Glass>

      {/* launch pad + smoke */}
      <rect
        x="230"
        y="262"
        width="110"
        height="8"
        rx="4"
        fill={W}
        opacity="0.12"
      />
      {[0, 1, 2, 3].map((i) => (
        <motion.circle
          key={i}
          cx={265 + i * 14}
          cy="258"
          r="10"
          fill={W}
          animate={{ opacity: [0.25, 0], scale: [0.6, 1.8], y: [0, -6] }}
          transition={{ ...linear, duration: 1.6, delay: i * 0.3 }}
        />
      ))}

      {/* rocket */}
      <motion.g
        animate={{ y: [8, -18, 8] }}
        transition={{ ...loop, duration: 3.2 }}
      >
        <motion.path
          d="M285 222 q-10 26 0 46 q10 -20 0 -46"
          fill="#fbbf24"
          animate={{ scaleY: [0.8, 1.25, 0.8] }}
          transition={{ ...loop, duration: 0.35 }}
          style={{ originY: 0 }}
        />
        <motion.path
          d="M285 222 q-6 16 0 28 q6 -12 0 -28"
          fill={W}
          animate={{ scaleY: [0.8, 1.3, 0.8] }}
          transition={{ ...loop, duration: 0.3 }}
          style={{ originY: 0 }}
        />
        <circle
          cx="285"
          cy="150"
          r="56"
          fill={A}
          filter={u("blur")}
          opacity="0.35"
        />
        <g filter={u("shadow")}>
          <path
            d="M285 70 c26 24 32 80 24 150 h-48 c-8 -70 -2 -126 24 -150z"
            fill="#eef0f6"
          />
          <path
            d="M285 70 c26 24 32 80 24 150 h-14 c6 -70 2 -122 -10 -150z"
            fill="#c9cdda"
          />
          <path
            d="M261 170 l-24 34 l24 -6z M309 170 l24 34 l-24 -6z"
            fill={u("accent")}
          />
          <rect x="271" y="214" width="28" height="10" rx="3" fill="#6b7080" />
        </g>
        <circle
          cx="285"
          cy="128"
          r="14"
          fill="#0f1016"
          stroke={A}
          strokeWidth="4"
        />
        <circle cx="281" cy="124" r="4" fill={W} opacity="0.6" />
      </motion.g>

      {/* stars */}
      {[
        [200, 60],
        [360, 80],
        [370, 180],
        [210, 230],
      ].map(([x, y], i) => (
        <motion.path
          key={i}
          d={`M${x} ${y - 5} L${x} ${y + 5} M${x - 5} ${y} L${x + 5} ${y}`}
          stroke={W}
          strokeWidth="1.5"
          animate={{ opacity: [0.15, 0.9, 0.15] }}
          transition={{ ...loop, duration: 1.8, delay: i * 0.4 }}
        />
      ))}
    </g>
  );
}

const scenes: Record<string, () => React.JSX.Element> = {
  idea: IdeaScene,
  research: ResearchScene,
  design: DesignScene,
  backend: BackendScene,
  build: BuildScene,
  launch: LaunchScene,
};
