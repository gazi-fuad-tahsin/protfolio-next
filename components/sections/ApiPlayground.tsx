"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import { L } from "@/components/ui/L";
import { useLang } from "@/components/layout/LangToggle";

const endpoints = [
  { path: "/api/profile", desc: "Who I am, what I do, my stack" },
  { path: "/api/projects", desc: "All projects" },
  { path: "/api/projects?category=Backend", desc: "Filter by category" },
  { path: "/api/projects/orbit-task", desc: "One project in detail" },
  { path: "/api/posts", desc: "Engineering notes" },
  { path: "/api/health", desc: "Service health check" },
];

type Result = { status: number; ms: number; size: number; body: string } | null;

/** Colour JSON tokens: keys, strings, numbers, booleans/null. */
function colorize(json: string) {
  const esc = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return esc.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (m) => {
      let c = "#fbbf24"; // number
      if (m.startsWith('"')) c = m.endsWith(":") ? "var(--accent)" : "#86efac";
      else if (/true|false|null/.test(m)) c = "#f9a8d4";
      return `<span style="color:${c}">${m}</span>`;
    },
  );
}

type StepState = "pending" | "active" | "done" | "error";
type Step = {
  key: string;
  active: [string, string];
  done: [string, string];
  state: StepState;
  ms?: number;
};
type Phase = "idle" | "running" | "done";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

function makeSteps(host: string, path: string): Step[] {
  return [
    {
      key: "dns",
      active: [`Resolving ${host}…`, `${host} খোঁজা হচ্ছে…`],
      done: [`Resolved ${host}`, `${host} পাওয়া গেছে`],
      state: "pending",
    },
    {
      key: "tcp",
      active: ["Opening connection…", "কানেকশন খোলা হচ্ছে…"],
      done: ["Connection established", "কানেকশন তৈরি হয়েছে"],
      state: "pending",
    },
    {
      key: "req",
      active: [`Sending GET ${path}…`, `GET ${path} পাঠানো হচ্ছে…`],
      done: [
        `Request sent · GET ${path}`,
        `রিকোয়েস্ট পাঠানো হয়েছে · GET ${path}`,
      ],
      state: "pending",
    },
    {
      key: "res",
      active: ["Waiting for response…", "রেসপন্সের অপেক্ষা…"],
      done: ["Response received", "রেসপন্স পাওয়া গেছে"],
      state: "pending",
    },
    {
      key: "ok",
      active: ["Parsing JSON…", "JSON পড়া হচ্ছে…"],
      done: ["Fetch successful", "ফেচ সফল"],
      state: "pending",
    },
  ];
}

function StepIcon({ state }: { state: StepState }) {
  if (state === "active")
    return (
      <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/20 border-t-[var(--accent-on-ink)]" />
    );
  if (state === "done")
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
        ✓
      </span>
    );
  if (state === "error")
    return (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
        ✕
      </span>
    );
  return (
    <span className="h-4 w-4 shrink-0 rounded-full border border-white/25" />
  );
}

export function ApiPlayground() {
  const bnMode = useLang() === "bn";
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [steps, setSteps] = useState<Step[]>([]);
  const [result, setResult] = useState<Result>(null);
  const [copied, setCopied] = useState(false);
  const runId = useRef(0);
  const ep = endpoints[active];
  const loading = phase === "running";

  function clear() {
    runId.current++; // cancels a run in progress
    setPhase("idle");
    setSteps([]);
    setResult(null);
  }

  async function send() {
    const id = ++runId.current;
    const path = ep.path;
    const list = makeSteps(window.location.host, path);
    const alive = () => runId.current === id;
    const mark = (i: number, state: StepState, ms?: number) => {
      list[i] = { ...list[i], state, ms };
      setSteps([...list]);
    };

    setResult(null);
    setSteps(list);
    setPhase("running");
    mark(0, "active");

    // real request; its timings drive the numbers shown for each step
    const url = new URL(path, window.location.href).href;
    const fetchStart = performance.now();
    const request = fetch(path, { cache: "no-store" })
      .then(async (res) => ({
        res,
        text: await res.text(),
        end: performance.now(),
      }))
      .catch(() => null);
    const [out] = await Promise.all([request, wait(420)]);
    if (!alive()) return;

    const total = out ? out.end - fetchStart : 0;
    const t = performance.getEntriesByName(url).at(-1) as
      PerformanceResourceTiming | undefined;
    // a reused keep-alive connection reports 0 for DNS/TCP — show a small realistic value instead
    const jitter = (min: number, max: number) =>
      Math.round((min + Math.random() * (max - min)) * 10) / 10;
    const real = (v: number | undefined, min: number, max: number) =>
      v && v > 0.05 ? Math.round(v * 10) / 10 : jitter(min, max);
    const dns = real(t && t.domainLookupEnd - t.domainLookupStart, 0.4, 3.5);
    const tcp = real(t && t.connectEnd - t.connectStart, 0.8, 4.5);
    const sent = real(
      t && t.responseStart > 0
        ? Math.min(1.5, (t.responseStart - t.requestStart) * 0.08)
        : undefined,
      0.2,
      1.2,
    );
    const ttfb =
      t && t.responseStart > 0
        ? Math.max(1, t.responseStart - t.requestStart)
        : Math.max(1, total * 0.85);
    const download =
      t && t.responseEnd > t.responseStart
        ? t.responseEnd - t.responseStart
        : 0;

    const paced = [
      { i: 0, ms: dns },
      { i: 1, ms: tcp },
      { i: 2, ms: sent },
    ];
    mark(0, "done", dns);
    for (const { i, ms } of paced.slice(1)) {
      mark(i, "active");
      await wait(260 + Math.random() * 160);
      if (!alive()) return;
      mark(i, "done", ms);
    }

    mark(3, "active");
    await wait(300 + Math.random() * 200);
    if (!alive()) return;

    if (!out) {
      mark(3, "error");
      list[4] = { ...list[4], done: ["Network error", "নেটওয়ার্ক সমস্যা"] };
      mark(4, "error");
      await wait(650);
      if (!alive()) return;
      setResult({
        status: 0,
        ms: 0,
        size: 0,
        body: JSON.stringify({ error: "Network error" }, null, 2),
      });
      setPhase("done");
      return;
    }

    mark(3, "done", Math.round((ttfb + download) * 10) / 10);
    mark(4, "active");

    const p0 = performance.now();
    let body = out.text;
    try {
      body = JSON.stringify(JSON.parse(out.text), null, 2);
    } catch {}
    const parse = Math.max(0.1, Math.round((performance.now() - p0) * 10) / 10);
    await wait(260);
    if (!alive()) return;

    const okStatus = out.res.ok;
    list[4] = {
      ...list[4],
      done: okStatus
        ? [
            `Fetch successful · ${out.res.status} OK`,
            `ফেচ সফল · ${out.res.status} OK`,
          ]
        : [
            `Request failed · ${out.res.status}`,
            `রিকোয়েস্ট ব্যর্থ · ${out.res.status}`,
          ],
    };
    mark(4, okStatus ? "done" : "error", parse);

    await wait(650); // let the success line land before swapping to the JSON
    if (!alive()) return;
    setResult({
      status: out.res.status,
      ms: Math.max(1, Math.round(total)),
      size: new Blob([out.text]).size,
      body,
    });
    setPhase("done");
  }

  function copyCurl() {
    navigator.clipboard?.writeText(`curl ${window.location.origin}${ep.path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <SectionHeading
          i18n="api"
          title="Try my API"
          intro="This portfolio runs its own small REST API. Pick an endpoint, hit Send, and see a real response."
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="relative mt-12 overflow-hidden rounded-[24px] bg-ink text-ink-fg shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
          <div
            aria-hidden
            className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent opacity-20 blur-3xl"
          />
          <div className="relative grid lg:grid-cols-[300px_1fr]">
            {/* endpoints */}
            <ul
              className="border-b border-white/10 p-3 lg:border-r lg:border-b-0"
              aria-label="Endpoints"
            >
              {endpoints.map((e, i) => (
                <li key={e.path}>
                  <button
                    type="button"
                    aria-pressed={i === active}
                    onClick={() => {
                      setActive(i);
                      clear();
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${i === active ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <span className="mt-0.5 rounded-md bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">
                      GET
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-[13px]">
                        {e.path}
                      </span>
                      <span className="block text-xs text-white/60">
                        {e.desc}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* request + response */}
            <div className="min-w-0 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-2">
                <span className="rounded-lg bg-emerald-500/20 px-2 py-1 font-mono text-xs font-bold text-emerald-300">
                  GET
                </span>
                <code className="min-w-0 flex-1 truncate px-1 font-mono text-[13px] text-white/90">
                  {ep.path}
                </code>
                <button
                  type="button"
                  onClick={copyCurl}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
                >
                  {copied ? (
                    <L k="api.copied">Copied</L>
                  ) : (
                    <L k="api.copy">Copy curl</L>
                  )}
                </button>
                <button
                  type="button"
                  onClick={clear}
                  disabled={phase === "idle"}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <L k="api.clear">Clear</L>
                </button>
                <button
                  type="button"
                  onClick={send}
                  disabled={loading}
                  className="display inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-base text-accent-fg transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading && (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent-fg/30 border-t-accent-fg" />
                  )}
                  <L k="api.send">Send</L>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-white/60">
                <span className="font-semibold tracking-wider uppercase">
                  <L k="api.response">Response</L>
                </span>
                {phase === "done" && result && (
                  <>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono font-bold ${
                        result.status >= 200 && result.status < 300
                          ? "bg-emerald-500/20 text-emerald-300"
                          : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {result.status || "ERR"}
                    </span>
                    <span className="font-mono">{result.ms} ms</span>
                    <span className="font-mono">
                      {(result.size / 1024).toFixed(1)} KB
                    </span>
                  </>
                )}
              </div>

              <div
                className="relative mt-3 h-[320px] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4"
                aria-live="polite"
              >
                <AnimatePresence mode="wait">
                  {phase === "done" && result ? (
                    <motion.pre
                      key={`json-${result.ms}-${result.size}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[12.5px] leading-relaxed whitespace-pre text-white/85"
                      dangerouslySetInnerHTML={{
                        __html: colorize(result.body),
                      }}
                    />
                  ) : phase === "running" ? (
                    <motion.ol
                      key="checks"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="flex h-full flex-col items-center justify-center gap-3"
                    >
                      {steps.map((st) => (
                        <motion.li
                          key={st.key}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{
                            opacity: st.state === "pending" ? 0.35 : 1,
                            y: 0,
                          }}
                          className="flex w-full max-w-[420px] items-center gap-3 font-mono text-[13px]"
                        >
                          <StepIcon state={st.state} />
                          <span
                            className={`flex-1 truncate ${
                              st.state === "done" && st.key === "ok"
                                ? "font-semibold text-emerald-300"
                                : st.state === "error"
                                  ? "text-red-300"
                                  : st.state === "pending"
                                    ? "text-white/40"
                                    : "text-white/85"
                            }`}
                          >
                            {
                              (st.state === "done" || st.state === "error"
                                ? st.done
                                : st.active)[bnMode ? 1 : 0]
                            }
                          </span>
                          {st.ms !== undefined &&
                            (st.state === "done" || st.state === "error") && (
                              <span className="text-[11px] tabular-nums text-white/40">
                                {st.ms < 10
                                  ? st.ms.toFixed(1)
                                  : Math.round(st.ms)}
                                ms
                              </span>
                            )}
                        </motion.li>
                      ))}
                    </motion.ol>
                  ) : (
                    <motion.div
                      key="hint"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex h-full flex-col items-center justify-center gap-3 text-center text-sm text-white/50"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 font-mono text-lg text-white/40">
                        {"{ }"}
                      </span>
                      <L k="api.hint">Hit Send to see the response</L>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
