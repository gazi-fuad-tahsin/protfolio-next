"use client";

import { useInView } from "motion/react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type TerminalData = {
  name: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  resume: string;
  available: boolean;
  bio: string[];
  socials: { name: string; url: string }[];
  experience: { role: string; company: string; period: string }[];
  skills: { group: string; items: string[] }[];
  learning: { name: string; progress: number; items: string[] }[];
  projects: { slug: string; title: string; category: string; year: string }[];
  postsCount: number;
};

type Line = {
  id: number;
  kind: "cmd" | "out";
  node: ReactNode;
  prompt?: string;
};

/** Helpers handed to long-running commands so they can stream output. */
type IO = {
  print: (node: ReactNode) => number;
  update: (id: number, node: ReactNode) => void;
  sleep: (ms: number) => Promise<void>;
  alive: () => boolean;
};
type Task = { task: (io: IO) => Promise<void> };
type Output = ReactNode | "clear" | Task | null;

type Mode =
  null | { kind: "vim" } | { kind: "guess"; target: number; tries: number };

const PROMPT_USER = "visitor";
const PROMPT_HOST = "tahsin";

const infoCommands: { name: string; desc: string }[] = [
  { name: "help", desc: "list all commands" },
  { name: "whoami", desc: "who I am" },
  { name: "about", desc: "a short bio" },
  { name: "experience", desc: "where I've worked" },
  { name: "skills", desc: "my tech stack" },
  { name: "projects", desc: "things I've built" },
  { name: "open", desc: "open <project>" },
  { name: "learning", desc: "what I'm learning now" },
  { name: "education", desc: "degree & competitive programming" },
  { name: "contact", desc: "how to reach me" },
  { name: "socials", desc: "my profiles" },
  { name: "resume", desc: "download my CV" },
  { name: "ls", desc: "list files" },
  { name: "cat", desc: "cat <file>" },
  { name: "history", desc: "commands you've run" },
  { name: "clear", desc: "clear the screen" },
];

const funCommands: { name: string; desc: string }[] = [
  { name: "journey", desc: "my journey in 3D (About page)" },
  { name: "neofetch", desc: "system info, portfolio edition" },
  { name: "ping", desc: "ping tahsin.dev — real latency" },
  { name: "curl", desc: "curl /api/profile — real API call" },
  { name: "weather", desc: "live weather in Dhaka" },
  { name: "git", desc: "git log — my career as commits" },
  { name: "npm", desc: "npm install tahsin" },
  { name: "matrix", desc: "follow the white rabbit" },
  { name: "hack", desc: "totally real hacking" },
  { name: "coffee", desc: "brew a cup" },
  { name: "cowsay", desc: "cowsay <text>" },
  { name: "fortune", desc: "a random dev joke" },
  { name: "guess", desc: "guess-the-number game" },
  { name: "vim", desc: "good luck getting out" },
  { name: "uptime", desc: "how long you've been here" },
  { name: "theme", desc: "toggle dark / light" },
  { name: "date", desc: "current date & time" },
  { name: "echo", desc: "echo <text>" },
];

const allCommandNames = [...infoCommands, ...funCommands].map((c) => c.name);

const suggestions = [
  "help",
  "whoami",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];
const funSuggestions = [
  "neofetch",
  "ping tahsin.dev",
  "weather",
  "git log",
  "matrix",
  "coffee",
  "fortune",
  "guess",
];

const files = [
  "about.txt",
  "skills.json",
  "projects/",
  "resume.pdf",
  "contact.md",
];

const fortunes = [
  "There are 10 kinds of people: those who understand binary and those who don't.",
  "It works on my machine. — every developer, ever",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Weeks of coding can save you hours of planning.",
  "The best code is no code at all.",
  "Debugging: being the detective in a crime movie where you are also the murderer.",
  "Real programmers count from 0.",
  "Deploying on Friday? Bold. I like it. (Please don't.)",
  "// TODO: write a better fortune",
  "First, solve the problem. Then, write the code. — John Johnson",
];

/* small styled pieces */
const Accent = ({ children }: { children: ReactNode }) => (
  <span className="text-[var(--accent-on-ink)]">{children}</span>
);
const Dim = ({ children }: { children: ReactNode }) => (
  <span className="text-white/45">{children}</span>
);
const Green = ({ children }: { children: ReactNode }) => (
  <span className="text-emerald-300">{children}</span>
);
const Yellow = ({ children }: { children: ReactNode }) => (
  <span className="text-amber-300">{children}</span>
);
const Red = ({ children }: { children: ReactNode }) => (
  <span className="text-red-400">{children}</span>
);

function bar(pct: number, width = 20) {
  const filled = Math.round((pct / 100) * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

/** tiny deterministic "commit hash" */
function hash(s: string) {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

const weatherText: Record<number, string> = {
  0: "☀️  Clear sky",
  1: "🌤  Mainly clear",
  2: "⛅ Partly cloudy",
  3: "☁️  Overcast",
  45: "🌫  Fog",
  48: "🌫  Fog",
  51: "🌦  Light drizzle",
  53: "🌦  Drizzle",
  55: "🌧  Heavy drizzle",
  61: "🌧  Light rain",
  63: "🌧  Rain",
  65: "🌧  Heavy rain",
  80: "🌦  Rain showers",
  81: "🌧  Rain showers",
  82: "⛈  Violent showers",
  95: "⛈  Thunderstorm",
  96: "⛈  Thunderstorm, hail",
  99: "⛈  Thunderstorm, hail",
};

/** Simple JSON colouring for `curl`. */
function JsonView({ value }: { value: unknown }) {
  const json = JSON.stringify(value, null, 2);
  const parts = json.split(
    /("(?:\\.|[^"\\])*"\s*:?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?)/g,
  );
  return (
    <pre className="whitespace-pre-wrap">
      {parts.map((p, i) => {
        if (/^".*":$/.test(p.trim())) return <Accent key={i}>{p}</Accent>;
        if (p.startsWith('"')) return <Green key={i}>{p}</Green>;
        if (/^(true|false|null)$/.test(p))
          return (
            <span key={i} className="text-pink-300">
              {p}
            </span>
          );
        if (/^-?\d/.test(p)) return <Yellow key={i}>{p}</Yellow>;
        return p;
      })}
    </pre>
  );
}

/** Falling green glyphs over the terminal screen. */
function MatrixRain({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    const size = 14;
    const cols = Math.floor(width / size);
    const drops = Array.from({ length: cols }, () => Math.random() * -40);
    const glyphs = "アイウエオカキクケコサシスセソ0123456789ABCDEF<>/{}[]=+*";
    let raf = 0;
    const draw = () => {
      ctx.fillStyle = "rgba(13,14,20,0.18)";
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${size}px monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.96 ? "#d1fae5" : "#34d399";
        ctx.fillText(
          glyphs[Math.floor(Math.random() * glyphs.length)],
          i * size,
          y * size,
        );
        drops[i] = y * size > height && Math.random() > 0.975 ? 0 : y + 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const stop = setTimeout(onDone, 5000);
    const key = () => onDone();
    // listen a moment later, so the Enter that launched `matrix` doesn't immediately stop it
    const listen = setTimeout(() => window.addEventListener("keydown", key), 250);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(stop);
      clearTimeout(listen);
      window.removeEventListener("keydown", key);
    };
  }, [onDone]);
  return (
    <canvas
      ref={ref}
      onClick={onDone}
      className="absolute inset-0 z-10 h-full w-full cursor-pointer rounded-b-[20px]"
      aria-label="Matrix animation — press any key to stop"
    />
  );
}

export function TerminalClient({
  data,
  variant = "page",
  onNavigate,
}: {
  data: TerminalData;
  /** "modal" = opened from the navbar: fills the dialog, focuses input, no top margin */
  variant?: "page" | "modal";
  /** called before `open <project>` navigates (the modal uses it to close itself) */
  onNavigate?: () => void;
}) {
  const isModal = variant === "modal";
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-120px" });

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [busy, setBusy] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const [shake, setShake] = useState(false);
  const [mode, setMode] = useState<Mode>(null);
  const booted = useRef(false);
  const idRef = useRef(0);
  const runToken = useRef(0);
  const loadedAt = useRef(0);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  const push = useCallback(
    (kind: Line["kind"], node: ReactNode, prompt?: string) => {
      const id = idRef.current++;
      setLines((l) => [...l, { id, kind, node, prompt }]);
      return id;
    },
    [],
  );

  const update = useCallback((id: number, node: ReactNode) => {
    setLines((l) => l.map((x) => (x.id === id ? { ...x, node } : x)));
  }, []);

  const promptText =
    mode?.kind === "guess" ? "guess>" : mode?.kind === "vim" ? ":" : null;

  /* ---------------------------------------------------------- command output */
  const run = useCallback(
    (raw: string): Output => {
      const trimmed = raw.trim();
      const [cmd, ...args] = trimmed.split(/\s+/);
      const arg = args.join(" ");

      const aboutOut = () => (
        <div className="space-y-2">
          {data.bio.map((b) => (
            <p key={b}>{b}</p>
          ))}
        </div>
      );
      const contactOut = () => (
        <div>
          <p>
            email <Accent>{data.email}</Accent>
          </p>
          <p>
            phone <Accent>{data.phone}</Accent>
          </p>
          <p>
            <Dim>…or use the contact form at the bottom of the home page.</Dim>
          </p>
        </div>
      );

      if (/^rm\s+-[rf]{2}/.test(trimmed)) {
        setShake(true);
        setTimeout(() => setShake(false), 600);
        return (
          <p>
            <Red>🚫 rm: refusing to delete my portfolio.</Red>{" "}
            <Dim>It took a while to build, be nice 😅</Dim>
          </p>
        );
      }

      switch ((cmd ?? "").toLowerCase()) {
        case "":
          return null;

        /* ----------------------------------------------------- about me */
        case "help":
          return (
            <div>
              <p>
                <Green>About me</Green>
              </p>
              <div className="grid gap-x-6 sm:grid-cols-2">
                {infoCommands.map((c) => (
                  <p key={c.name}>
                    <Accent>{c.name.padEnd(11, " ")}</Accent>
                    <Dim>{c.desc}</Dim>
                  </p>
                ))}
              </div>
              <p className="mt-2">
                <Green>Just for fun</Green>
              </p>
              <div className="grid gap-x-6 sm:grid-cols-2">
                {funCommands.map((c) => (
                  <p key={c.name}>
                    <Accent>{c.name.padEnd(11, " ")}</Accent>
                    <Dim>{c.desc}</Dim>
                  </p>
                ))}
              </div>
              <p className="mt-1">
                <Dim>Tip: ↑/↓ history · Tab autocomplete · Ctrl+L clear</Dim>
              </p>
            </div>
          );
        case "whoami":
          return (
            <div>
              <p>
                <Green>{data.name}</Green>
              </p>
              <p>{data.role}</p>
              <p>
                <Dim>📍 {data.location}</Dim>
              </p>
              <p>
                status:{" "}
                {data.available ? (
                  <Green>● available for work</Green>
                ) : (
                  <Yellow>● currently busy</Yellow>
                )}
              </p>
            </div>
          );
        case "about":
          return aboutOut();
        case "experience":
          return (
            <div>
              {data.experience.map((e) => (
                <p key={e.role + e.company}>
                  <Yellow>{e.period.padEnd(20, " ")}</Yellow>
                  <Accent>{e.role}</Accent> <Dim>@ {e.company}</Dim>
                </p>
              ))}
            </div>
          );
        case "skills":
          return (
            <div className="space-y-1">
              {data.skills.map((s) => (
                <p key={s.group}>
                  <Accent>{s.group}</Accent>
                  <br />
                  <Dim>└─ </Dim>
                  {s.items.join(", ")}
                </p>
              ))}
            </div>
          );
        case "learning":
          return (
            <div className="space-y-1">
              {data.learning.map((t) => (
                <p key={t.name}>
                  <Accent>{t.name.padEnd(15, " ")}</Accent>
                  <Green>{bar(t.progress)}</Green> {t.progress}%
                  <br />
                  <Dim>└─ {t.items.join(" · ")}</Dim>
                </p>
              ))}
            </div>
          );
        case "projects":
          return (
            <div>
              {data.projects.map((p) => (
                <p key={p.slug}>
                  <Accent>{p.slug.padEnd(32, " ")}</Accent>
                  <Dim>{p.category}</Dim>
                </p>
              ))}
              <p className="mt-1">
                <Dim>Run </Dim>
                <Accent>open &lt;name&gt;</Accent>
                <Dim> to view one, e.g. </Dim>
                <Accent>open {data.projects[1]?.slug}</Accent>
              </p>
            </div>
          );
        case "open": {
          const p = data.projects.find(
            (x) =>
              x.slug === arg.toLowerCase() ||
              x.title.toLowerCase() === arg.toLowerCase(),
          );
          if (!arg)
            return (
              <Yellow>
                usage: open &lt;project&gt; — run `projects` to see names
              </Yellow>
            );
          if (!p) return <Yellow>open: no such project: {arg}</Yellow>;
          setTimeout(() => {
            onNavigate?.();
            router.push(`/projects/${p.slug}`);
          }, 700);
          return (
            <p>
              Opening <Accent>{p.title}</Accent>…{" "}
              <Dim>(/projects/{p.slug})</Dim>
            </p>
          );
        }
        case "education":
          return (
            <div>
              {data.experience
                .filter((e) => /b\.?sc|university/i.test(e.role + e.company))
                .map((e) => (
                  <p key={e.role}>
                    🎓 <Accent>{e.role}</Accent>{" "}
                    <Dim>
                      — {e.company}, {e.period}
                    </Dim>
                  </p>
                ))}
              <p>
                🏆 ICPC Asia Dhaka Regional 2021 · Runner-up, University
                Programming Competition
              </p>
              <p>
                <Dim>Competitive programming on Codeforces & CodeChef</Dim>
              </p>
            </div>
          );
        case "contact":
          return contactOut();
        case "socials":
          return (
            <div>
              {data.socials.map((s) => (
                <p key={s.name}>
                  <Accent>{s.name.padEnd(12, " ")}</Accent>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline decoration-white/30 underline-offset-2 hover:text-white"
                  >
                    {s.url}
                  </a>
                </p>
              ))}
            </div>
          );
        case "resume":
        case "cv": {
          const a = document.createElement("a");
          a.href = data.resume;
          a.download = "";
          a.click();
          return <Green>↓ Downloading resume…</Green>;
        }
        case "ls":
          return (
            <p>
              {files.map((f) => (
                <span key={f} className="mr-4">
                  {f.endsWith("/") ? <Accent>{f}</Accent> : f}
                </span>
              ))}
            </p>
          );
        case "cat": {
          const f = arg.replace(/^\.\//, "");
          if (f === "about.txt") return aboutOut();
          if (f === "skills.json")
            return (
              <JsonView
                value={Object.fromEntries(
                  data.skills.map((s) => [s.group, s.items]),
                )}
              />
            );
          if (f === "contact.md") return contactOut();
          if (f === "resume.pdf")
            return (
              <Yellow>
                cat: resume.pdf is binary — try `resume` to download it
              </Yellow>
            );
          if (f === "projects" || f === "projects/")
            return (
              <Yellow>cat: projects/: is a directory — try `projects`</Yellow>
            );
          return (
            <Yellow>cat: {arg || "missing file operand"}: No such file</Yellow>
          );
        }
        case "history":
          return (
            <div>
              {history.length === 0 ? (
                <Dim>no commands yet</Dim>
              ) : (
                history.map((h, i) => (
                  <p key={i}>
                    <Dim>{String(i + 1).padStart(3, " ")} </Dim>
                    {h}
                  </p>
                ))
              )}
            </div>
          );
        case "clear":
          return "clear";

        /* ------------------------------------------------------- fun */
        case "journey":
          setTimeout(() => {
            onNavigate?.();
            router.push("/about#journey");
          }, 600);
          return (
            <p>
              Launching <Accent>3D journey</Accent>… 🚀
            </p>
          );

        case "neofetch": {
          const mins = Math.max(
            0,
            Math.round((Date.now() - loadedAt.current) / 60000),
          );
          const theme =
            document.documentElement.dataset.theme === "dark"
              ? "Dark"
              : "Light";
          const art = [
            "   ██████  ████████ ",
            "  ██          ██    ",
            "  ██   ███    ██    ",
            "  ██    ██    ██    ",
            "   ██████     ██    ",
          ];
          const rows: [string, string][] = [
            ["OS", "PortfolioOS 26.10 (Next.js 16)"],
            ["Host", "tahsin.dev"],
            ["Kernel", "Node.js · TypeScript"],
            ["Uptime", `${mins} min (on this page)`],
            [
              "Packages",
              `${data.projects.length} projects, ${data.postsCount} articles`,
            ],
            ["Shell", "zsh 5.9 (portfolio edition)"],
            ["Resolution", `${window.innerWidth}x${window.innerHeight}`],
            ["Theme", theme],
            ["CPU", "Brain v26 (8) @ caffeine GHz"],
            ["Memory", "2 / 3 cups of coffee"],
            ["Location", data.location],
          ];
          return (
            <div className="flex flex-col gap-4 sm:flex-row">
              <pre className="text-[var(--accent-on-ink)] leading-tight">
                {art.join("\n")}
              </pre>
              <div>
                <p>
                  <Green>visitor</Green>@<Accent>tahsin</Accent>
                </p>
                <p>
                  <Dim>-----------------</Dim>
                </p>
                {rows.map(([k, v]) => (
                  <p key={k}>
                    <Accent>{k}</Accent>: {v}
                  </p>
                ))}
                <p className="mt-1 flex gap-1">
                  {[
                    "#ef4444",
                    "#f59e0b",
                    "#22c55e",
                    "#3b82f6",
                    "#a855f7",
                    "#ec4899",
                    "#e5e7eb",
                  ].map((c) => (
                    <span
                      key={c}
                      className="inline-block h-3 w-5"
                      style={{ background: c }}
                    />
                  ))}
                </p>
              </div>
            </div>
          );
        }

        case "ping":
          return {
            task: async ({ print, sleep, alive }) => {
              const host = arg || "tahsin.dev";
              print(
                <p>
                  PING {host} ({window.location.host}): 56 data bytes
                </p>,
              );
              const times: number[] = [];
              for (let i = 1; i <= 4; i++) {
                const t0 = performance.now();
                try {
                  await fetch("/api/health", { cache: "no-store" });
                  const ms = performance.now() - t0;
                  times.push(ms);
                  if (!alive()) return;
                  print(
                    <p>
                      64 bytes from {host}: icmp_seq={i} ttl=64 time=
                      <Green>{ms.toFixed(1)} ms</Green>
                    </p>,
                  );
                } catch {
                  print(<Red>Request timeout for icmp_seq {i}</Red>);
                }
                await sleep(550);
                if (!alive()) return;
              }
              if (times.length) {
                const min = Math.min(...times);
                const max = Math.max(...times);
                const avg = times.reduce((a, b) => a + b, 0) / times.length;
                print(
                  <div>
                    <p>--- {host} ping statistics ---</p>
                    <p>
                      4 packets transmitted, {times.length} received,{" "}
                      {(((4 - times.length) / 4) * 100).toFixed(0)}% packet loss
                    </p>
                    <p>
                      round-trip min/avg/max = {min.toFixed(1)}/{avg.toFixed(1)}
                      /{max.toFixed(1)} ms
                    </p>
                  </div>,
                );
              }
            },
          };

        case "curl": {
          const path = arg || "/api/profile";
          if (!path.startsWith("/api/"))
            return (
              <Yellow>
                curl: only this site&apos;s API is allowed here — try `curl
                /api/projects`
              </Yellow>
            );
          return {
            task: async ({ print, alive }) => {
              const t0 = performance.now();
              try {
                const res = await fetch(path, { cache: "no-store" });
                const body = await res.json().catch(() => null);
                if (!alive()) return;
                print(
                  <Dim>
                    HTTP/1.1 {res.status} {res.ok ? "OK" : res.statusText} ·{" "}
                    {(performance.now() - t0).toFixed(1)} ms
                  </Dim>,
                );
                print(<JsonView value={body} />);
              } catch {
                print(<Red>curl: (7) Failed to connect</Red>);
              }
            },
          };
        }

        case "weather":
          return {
            task: async ({ print, update, alive }) => {
              const id = print(<Dim>Fetching live weather for Dhaka…</Dim>);
              try {
                const res = await fetch(
                  "https://api.open-meteo.com/v1/forecast?latitude=23.81&longitude=90.41&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=Asia%2FDhaka",
                );
                const j = await res.json();
                if (!alive()) return;
                const c = j.current;
                update(
                  id,
                  <div>
                    <p>
                      Weather in <Accent>Dhaka, Bangladesh</Accent>
                    </p>
                    <p>{weatherText[c.weather_code] ?? "🌡  —"}</p>
                    <p>
                      🌡 <Yellow>{c.temperature_2m}°C</Yellow> · 💧{" "}
                      {c.relative_humidity_2m}% · 🌬 {c.wind_speed_10m} km/h
                    </p>
                    <p>
                      <Dim>
                        source: open-meteo.com · {c.time.replace("T", " ")}
                      </Dim>
                    </p>
                  </div>,
                );
              } catch {
                update(
                  id,
                  <Red>
                    weather: couldn&apos;t reach the weather service — are you
                    offline?
                  </Red>,
                );
              }
            },
          };

        case "git": {
          if (args[0] !== "log") return <Yellow>git: try `git log`</Yellow>;
          const commits = data.experience.map((e) => ({
            msg: /b\.?sc/i.test(e.role)
              ? `docs: graduated — ${e.role}, ${e.company}`
              : `feat: ${e.role} @ ${e.company}`,
            date: e.period,
          }));
          commits.push({
            msg: "chore: competed at ICPC Asia Dhaka Regional",
            date: "2021",
          });
          return (
            <div className="space-y-2">
              {commits.map((c, i) => (
                <div key={c.msg}>
                  <p>
                    <Yellow>commit {hash(c.msg)}</Yellow>
                    {i === 0 && (
                      <span>
                        {" "}
                        (<Accent>HEAD</Accent> -&gt; <Green>main</Green>)
                      </span>
                    )}
                  </p>
                  <p>Author: {data.name}</p>
                  <p>Date: {c.date}</p>
                  <p className="pl-6">{c.msg}</p>
                </div>
              ))}
            </div>
          );
        }

        case "npm":
          if (args[0] !== "install" && args[0] !== "i")
            return <Yellow>npm: try `npm install tahsin`</Yellow>;
          return {
            task: async ({ print, update, sleep, alive }) => {
              const pkg = args[1] || "tahsin";
              print(
                <Dim>
                  npm WARN deprecated sleep@8h: replaced by coffee@latest
                </Dim>,
              );
              const id = print(<p>{bar(0, 24)} 0%</p>);
              for (
                let p = 0;
                p <= 100;
                p += 4 + Math.round(Math.random() * 8)
              ) {
                await sleep(70);
                if (!alive()) return;
                update(
                  id,
                  <p>{`${bar(p, 24)} ${p}% resolving ${["node", "typescript", "mongodb", "next", "flutter"][p % 5]}…`}</p>,
                );
              }
              update(id, <p>{`${bar(100, 24)} 100%`}</p>);
              print(
                <div>
                  <p>
                    + <Green>{pkg}@26.10.0</Green>
                  </p>
                  <p>
                    added <Accent>1 developer</Accent> (team leader, backend,
                    full stack) in {(1.2 + Math.random()).toFixed(1)}s
                  </p>
                  <p>
                    found <Green>0 vulnerabilities</Green> · run{" "}
                    <Accent>contact</Accent> to start using
                  </p>
                </div>,
              );
            },
          };

        case "matrix":
          setMatrix(true);
          return <Green>Wake up, Neo… (press any key to exit)</Green>;

        case "hack":
          return {
            task: async ({ print, update, sleep, alive }) => {
              const steps = [
                "Connecting to mainframe…",
                "Bypassing firewall (very sophisticated)…",
                "Decrypting 256-bit coffee encryption…",
                "Downloading more RAM…",
                "Reversing the polarity…",
              ];
              for (const s of steps) {
                print(<Green>{"> " + s}</Green>);
                await sleep(380);
                if (!alive()) return;
              }
              const id = print(<Green>[{bar(0, 24)}]</Green>);
              for (let p = 0; p <= 100; p += 10) {
                await sleep(90);
                if (!alive()) return;
                update(
                  id,
                  <Green>
                    [{bar(p, 24)}] {p}%
                  </Green>,
                );
              }
              print(
                <p className="text-lg font-bold text-emerald-300">
                  ACCESS GRANTED ✓
                </p>,
              );
              print(
                <Dim>
                  Just kidding. The only things I hack are deadlines and slow
                  queries.
                </Dim>,
              );
            },
          };

        case "coffee":
          return {
            task: async ({ print, update, sleep, alive }) => {
              const id = print(<p>☕ Brewing [{bar(0, 16)}] 0%</p>);
              for (let p = 0; p <= 100; p += 5) {
                await sleep(80);
                if (!alive()) return;
                update(
                  id,
                  <p>
                    ☕ Brewing [{bar(p, 16)}] {p}%
                  </p>,
                );
              }
              print(
                <Green>
                  Your coffee is ready. Now let&apos;s build something great.
                </Green>,
              );
            },
          };

        case "cowsay": {
          const text = arg || "Hire Tahsin!";
          const line = "─".repeat(text.length + 2);
          return (
            <pre>{`┌${line}┐
│ ${text} │
└${line}┘
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`}</pre>
          );
        }

        case "fortune":
          return (
            <p>🥠 {fortunes[Math.floor(Math.random() * fortunes.length)]}</p>
          );

        case "guess":
          setMode({
            kind: "guess",
            target: 1 + Math.floor(Math.random() * 100),
            tries: 0,
          });
          return (
            <p>
              I&apos;m thinking of a number between <Accent>1</Accent> and{" "}
              <Accent>100</Accent>. Type your guess — or <Accent>quit</Accent>.
            </p>
          );

        case "vim":
        case "vi":
        case "nano":
          setMode({ kind: "vim" });
          return (
            <pre className="text-white/60">{`~
~
~          VIM - Vi IMproved
~       you are now stuck in vim 😈
~
~   type  :q  and press Enter to exit
~`}</pre>
          );

        case "uptime": {
          const s = Math.round((Date.now() - loadedAt.current) / 1000);
          return (
            <p>
              up {Math.floor(s / 60)} min {s % 60} s on this page · load
              average: ☕ ☕ ☕
            </p>
          );
        }
        case "theme": {
          const root = document.documentElement;
          const next = root.dataset.theme === "dark" ? "light" : "dark";
          root.dataset.theme = next;
          try {
            localStorage.setItem("theme", next);
          } catch {}
          return <p>Theme switched to {next} mode.</p>;
        }
        case "date":
          return <p>{new Date().toString()}</p>;
        case "echo":
          return <p>{arg}</p>;
        case "pwd":
          return <p>/home/visitor/tahsin.dev</p>;
        case "cd":
          return <Dim>cd: you&apos;re already in the best place 😉</Dim>;
        case "sudo":
          return (
            <Yellow>
              Nice try 😄 — permission denied. Hire me and we can talk about
              root access.
            </Yellow>
          );
        case "exit":
          return <Dim>There&apos;s no escape — but you can scroll down 😉</Dim>;
        default:
          return (
            <p>
              <Yellow>command not found: {cmd}</Yellow> <Dim>— type</Dim>{" "}
              <Accent>help</Accent>
            </p>
          );
      }
    },
    [data, history, router, onNavigate],
  );

  /** Input while a "mode" (vim / guess) is active. */
  const handleMode = useCallback(
    (value: string): ReactNode => {
      if (mode?.kind === "vim") {
        if (/^:?(q|q!|wq|x)$/.test(value)) {
          setMode(null);
          return <Green>Phew — you escaped vim. Achievement unlocked 🏆</Green>;
        }
        return <Red>E37: No write since last change (type :q to quit)</Red>;
      }
      if (mode?.kind === "guess") {
        if (/^(quit|exit|q)$/i.test(value)) {
          setMode(null);
          return <Dim>Game over — it was {mode.target}.</Dim>;
        }
        const n = Number(value);
        if (!Number.isInteger(n) || n < 1 || n > 100)
          return <Yellow>Enter a whole number from 1 to 100.</Yellow>;
        const tries = mode.tries + 1;
        if (n === mode.target) {
          setMode(null);
          return (
            <Green>
              🎉 {n} is right! You got it in {tries}{" "}
              {tries === 1 ? "try" : "tries"}.
            </Green>
          );
        }
        setMode({ ...mode, tries });
        return <p>{n < mode.target ? "📈 Higher…" : "📉 Lower…"}</p>;
      }
      return null;
    },
    [mode],
  );

  const execute = useCallback(
    async (raw: string) => {
      const value = raw.trim();
      push("cmd", value, promptText ?? undefined);
      setInput("");
      setHIndex(-1);

      if (mode) {
        const out = handleMode(value);
        if (out) push("out", out);
        return;
      }

      if (value) setHistory((h) => [...h, value]);
      const out = run(value);
      if (out === "clear") setLines([]);
      else if (out && typeof out === "object" && "task" in out) {
        const token = ++runToken.current;
        setBusy(true);
        await out.task({
          print: (node) => push("out", node),
          update,
          sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
          alive: () => runToken.current === token,
        });
        setBusy(false);
        inputRef.current?.focus({ preventScroll: true });
      } else if (out) push("out", out);
    },
    [handleMode, mode, promptText, push, run, update],
  );

  /* type a command visibly, then run it */
  const typeAndRun = useCallback(
    async (cmd: string) => {
      if (busy) return;
      setBusy(true);
      for (let i = 1; i <= cmd.length; i++) {
        setInput(cmd.slice(0, i));
        await new Promise((r) => setTimeout(r, 40 + Math.random() * 40));
      }
      await new Promise((r) => setTimeout(r, 160));
      setBusy(false);
      await execute(cmd);
      inputRef.current?.focus({ preventScroll: true });
    },
    [busy, execute],
  );

  /* boot sequence when the terminal first scrolls into view */
  useEffect(() => {
    if (!inView || booted.current) return;
    booted.current = true;
    const boot: [number, ReactNode][] = [
      [
        0,
        <Dim key="b0">Last login: {new Date().toDateString()} on ttys001</Dim>,
      ],
      [
        350,
        <p key="b1">
          Welcome to <Accent>tahsin.dev</Accent> — portfolio shell v1.0
        </p>,
      ],
      [
        650,
        <Dim key="b2">
          Type `help` to see what you can do, or tap a command below.
        </Dim>,
      ],
    ];
    const timers = boot.map(([t, node]) =>
      setTimeout(() => push("out", node), t),
    );
    const auto = setTimeout(() => typeAndRun("whoami"), 1100);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(auto);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    if (isModal) inputRef.current?.focus({ preventScroll: true });
  }, [isModal]);

  /* keep the latest output in view */
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, input]);

  const stopMatrix = useCallback(() => {
    setMatrix(false);
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key.toLowerCase() === "c" && e.ctrlKey && busy) {
      e.preventDefault();
      runToken.current++; // Ctrl+C cancels a running command
      setBusy(false);
      push("out", <Dim>^C</Dim>);
      return;
    }
    if (busy) {
      e.preventDefault();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      execute(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const i = hIndex < 0 ? history.length - 1 : Math.max(0, hIndex - 1);
      setHIndex(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (hIndex < 0) return;
      const i = hIndex + 1;
      if (i >= history.length) {
        setHIndex(-1);
        setInput("");
      } else {
        setHIndex(i);
        setInput(history[i]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [first, ...rest] = input.split(" ");
      if (rest.length === 0) {
        const match = allCommandNames.filter((n) =>
          n.startsWith(first.toLowerCase()),
        );
        if (match.length === 1) setInput(match[0] + " ");
        else if (match.length > 1) push("out", <Dim>{match.join("   ")}</Dim>);
      } else if (first === "open" || first === "cat" || first === "curl") {
        const pool =
          first === "open"
            ? data.projects.map((p) => p.slug)
            : first === "cat"
              ? files
              : ["/api/profile", "/api/projects", "/api/posts", "/api/health"];
        const part = rest.join(" ").toLowerCase();
        const match = pool.filter((n) => n.startsWith(part));
        if (match.length === 1) setInput(`${first} ${match[0]}`);
        else if (match.length > 1) push("out", <Dim>{match.join("   ")}</Dim>);
      }
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }

  const prompt = (custom?: string) =>
    custom ? (
      <span className="mr-2 shrink-0 text-amber-300">{custom}</span>
    ) : (
      <span className="shrink-0">
        <span className="text-emerald-300">{PROMPT_USER}</span>
        <span className="text-white/40">@</span>
        <span className="text-[var(--accent-on-ink)]">{PROMPT_HOST}</span>
        <span className="mr-2 text-white/40">:~$</span>
      </span>
    );

  const chip = (s: string) => (
    <button
      key={s}
      type="button"
      disabled={busy || matrix}
      onClick={() => typeAndRun(s)}
      className="rounded-full border border-line bg-surface/60 px-3.5 py-1.5 font-mono text-[13px] text-muted transition hover:border-accent hover:text-fg disabled:opacity-50"
    >
      <span className="text-accent">$</span> {s}
    </button>
  );

  return (
    <div ref={wrapRef} className={isModal ? "" : "mt-12"}>
      <div
        className={`overflow-hidden rounded-[20px] border border-white/10 bg-[#0d0e14] text-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.7)] ${
          shake ? "term-shake" : ""
        }`}
      >
        {/* title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              className="h-3 w-3 rounded-full"
              style={{ background: c }}
            />
          ))}
          <span className="ml-3 font-mono text-xs text-white/50">
            {PROMPT_USER}@{PROMPT_HOST}: ~ —{" "}
            {mode?.kind === "vim"
              ? "vim"
              : mode?.kind === "guess"
                ? "guess"
                : "zsh"}
          </span>
          <button
            type="button"
            onClick={() => setLines([])}
            className="ml-auto rounded-md px-2 py-0.5 font-mono text-[11px] text-white/45 transition hover:bg-white/10 hover:text-white/80"
          >
            clear
          </button>
        </div>

        {/* screen */}
        <div className="relative">
          {matrix && <MatrixRain onDone={stopMatrix} />}
          <div
            ref={bodyRef}
            onClick={() => inputRef.current?.focus({ preventScroll: true })}
            className={`cursor-text overflow-y-auto overscroll-contain px-4 py-4 font-mono text-[13px] leading-relaxed text-white/85 sm:px-6 ${isModal ? "h-[min(60vh,520px)]" : "h-[380px] sm:h-[440px]"}`}
            role="log"
            aria-live="polite"
            aria-label="Terminal output"
          >
            {lines.map((l) =>
              l.kind === "cmd" ? (
                <p key={l.id} className="mt-2 flex flex-wrap first:mt-0">
                  {prompt(l.prompt)}
                  <span className="break-all text-white">{l.node}</span>
                </p>
              ) : (
                <div
                  key={l.id}
                  className="mt-0.5 break-words whitespace-pre-wrap"
                >
                  {l.node}
                </div>
              ),
            )}

            {/* live input line */}
            <div className="mt-2 flex items-center">
              {prompt(promptText ?? undefined)}
              <span className="relative flex-1">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => !busy && setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoComplete="off"
                  aria-label="Terminal input"
                  className="w-full bg-transparent text-[16px] text-white caret-[var(--accent-on-ink)] outline-none sm:text-[13px]"
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* quick commands */}
      <div className="mt-4 flex flex-wrap gap-2">{suggestions.map(chip)}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="mr-1 font-mono text-xs text-muted">fun →</span>
        {funSuggestions.map(chip)}
      </div>
    </div>
  );
}
