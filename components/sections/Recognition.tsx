import { CountUp, Reveal } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Primitives";
import { L } from "@/components/ui/L";
import { recognition } from "@/lib/data";

function Stars() {
  return (
    <div className="flex gap-1 text-accent" aria-label="5 out of 5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
          <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
        </svg>
      ))}
    </div>
  );
}

function Monogram({ text }: { text: string }) {
  const initials = text
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <span className="display flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm text-ink-fg">{initials}</span>
  );
}

/**
 * Bento grid. Real testimonials from data/recognition.json come first; the
 * factual highlights fill the rest, with the two stat cards woven in.
 */
export function Recognition() {
  const { testimonials, highlights, stats } = recognition;

  const cards = [
    ...testimonials.map((t) => (
      <div key={t.name} className="flex h-full flex-col justify-between gap-6 rounded-[20px] bg-surface p-6">
        <div>
          <Stars />
          <p className="mt-4 text-sm leading-relaxed text-muted">“{t.quote}”</p>
        </div>
        <div className="flex items-center gap-3">
          <Monogram text={t.name} />
          <div>
            <p className="text-sm font-semibold">{t.name}</p>
            <p className="text-xs text-muted">
              {t.title}, {t.company}
            </p>
          </div>
        </div>
      </div>
    )),
    ...highlights.map((h, hi) => (
      <div key={h.org} className="flex h-full flex-col justify-between gap-6 rounded-[20px] bg-surface p-6">
        <p className="text-sm leading-relaxed text-muted">
          <L k={`recognition.h.${hi}`}>{h.text}</L>
        </p>
        <div className="flex items-center gap-3">
          <Monogram text={h.org} />
          <div>
            <p className="text-sm font-semibold">{h.org}</p>
            <p className="text-xs text-muted">{h.period}</p>
          </div>
        </div>
      </div>
    )),
  ];

  const statCards = stats.map((s, si) => (
    <div
      key={s.label}
      className={`flex h-full min-h-[200px] flex-col justify-between rounded-[20px] p-6 ${s.tone === "ink" ? "bg-ink text-ink-fg" : "bg-accent text-accent-fg"}`}
    >
      <p className="text-sm opacity-80">
        <L k={`recognition.s.${si}.caption`}>{s.caption}</L>
      </p>
      <div>
        <CountUp value={s.value} suffix={s.suffix} className="display text-[56px] md:text-[64px]" />
        <p className="text-sm">
          <L k={`recognition.s.${si}.label`}>{s.label}</L>
        </p>
      </div>
    </div>
  ));

  // Same rhythm as the original bento: card, card, stat / stat, card, card …
  const grid = [...cards];
  if (statCards[0]) grid.splice(Math.min(2, grid.length), 0, statCards[0]);
  if (statCards[1]) grid.splice(Math.min(3, grid.length), 0, statCards[1]);
  grid.push(...statCards.slice(2));

  return (
    <section className="container-page py-24 md:py-32">
      <Reveal>
        <SectionHeading i18n="recognition" title={recognition.heading} intro={recognition.intro} />
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {grid.map((card, i) => (
          <Reveal key={i} delay={(i % 3) * 0.08}>
            {card}
          </Reveal>
        ))}
      </div>
    </section>
  );
}
