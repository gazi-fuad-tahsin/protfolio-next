"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import { L } from "@/components/ui/L";

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
  const esc = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

export function ApiPlayground() {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [copied, setCopied] = useState(false);
  const ep = endpoints[active];

  async function send(i = active) {
    setLoading(true);
    const t0 = performance.now();
    try {
      const res = await fetch(endpoints[i].path, { cache: "no-store" });
      const text = await res.text();
      const ms = Math.round(performance.now() - t0);
      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {}
      setResult({ status: res.status, ms, size: new Blob([text]).size, body });
    } catch {
      setResult({ status: 0, ms: 0, size: 0, body: '{\n  "error": "Network error"\n}' });
    } finally {
      setLoading(false);
    }
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
          <div aria-hidden className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-accent opacity-20 blur-3xl" />
          <div className="relative grid lg:grid-cols-[300px_1fr]">
            {/* endpoints */}
            <ul className="border-b border-white/10 p-3 lg:border-r lg:border-b-0" aria-label="Endpoints">
              {endpoints.map((e, i) => (
                <li key={e.path}>
                  <button
                    type="button"
                    aria-pressed={i === active}
                    onClick={() => {
                      setActive(i);
                      send(i);
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${i === active ? "bg-white/10" : "hover:bg-white/5"}`}
                  >
                    <span className="mt-0.5 rounded-md bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-300">GET</span>
                    <span className="min-w-0">
                      <span className="block truncate font-mono text-[13px]">{e.path}</span>
                      <span className="block text-xs text-white/60">{e.desc}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {/* request + response */}
            <div className="min-w-0 p-4 sm:p-6">
              <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-2">
                <span className="rounded-lg bg-emerald-500/20 px-2 py-1 font-mono text-xs font-bold text-emerald-300">GET</span>
                <code className="min-w-0 flex-1 truncate px-1 font-mono text-[13px] text-white/90">{ep.path}</code>
                <button
                  type="button"
                  onClick={copyCurl}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10"
                >
                  {copied ? <L k="api.copied">Copied</L> : <L k="api.copy">Copy curl</L>}
                </button>
                <button
                  type="button"
                  onClick={() => send()}
                  disabled={loading}
                  className="display inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-1.5 text-base text-accent-fg transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading && <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-accent-fg/30 border-t-accent-fg" />}
                  <L k="api.send">Send</L>
                </button>
              </div>

              <div className="mt-4 flex items-center gap-3 text-xs text-white/60">
                <span className="font-semibold tracking-wider uppercase">
                  <L k="api.response">Response</L>
                </span>
                {result && (
                  <>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono font-bold ${
                        result.status >= 200 && result.status < 300 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {result.status || "ERR"}
                    </span>
                    <span className="font-mono">{result.ms} ms</span>
                    <span className="font-mono">{(result.size / 1024).toFixed(1)} KB</span>
                  </>
                )}
              </div>

              <div className="relative mt-3 h-[320px] overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4" aria-live="polite">
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.pre
                      key={result.body}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="font-mono text-[12.5px] leading-relaxed whitespace-pre text-white/85"
                      dangerouslySetInnerHTML={{ __html: colorize(result.body) }}
                    />
                  ) : (
                    <motion.p key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex h-full items-center justify-center text-sm text-white/50">
                      <L k="api.hint">Hit Send to see the response</L>
                    </motion.p>
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
