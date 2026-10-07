"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { L } from "@/components/ui/L";

/** Thin accent bar at the very top that fills as you read. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-accent" />;
}

export type TocItem = { id: string; label: string };

/** "On this page" list that highlights the section currently being read. */
export function TableOfContents({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-3 text-xs font-semibold tracking-wider text-muted uppercase">
        <L k="blog.onThisPage">On this page</L>
      </p>
      <ol className="space-y-1 border-l border-line">
        {items.map((i, n) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`-ml-px block border-l-2 py-1.5 pl-4 leading-snug transition-colors ${
                active === i.id ? "border-accent font-medium text-fg" : "border-transparent text-muted hover:text-fg"
              }`}
            >
              <span className="mr-1.5 text-xs opacity-60">{String(n + 1).padStart(2, "0")}</span>
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Highlighted code (HTML prepared on the server) with a copy button. */
export function CodeBlock({ code, html }: { code: string; html: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="group relative mt-4">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        }}
        aria-label="Copy code"
        className="absolute top-3 right-3 z-10 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-white/80 opacity-100 transition hover:bg-white/15 sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
      >
        {copied ? <L k="blog.copied">Copied</L> : <L k="blog.copy">Copy</L>}
      </button>
      <pre className="code-block !mt-0">
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
