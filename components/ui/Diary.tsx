"use client";

import { motion, useTransform, type MotionValue } from "motion/react";
import { Portrait } from "./Portrait";
import profile from "@/data/profile.json";

const { diary } = profile;

const paper = "#f7f2e8";
const ink = "#2b2a33";

/** Faint ruled lines + margin, like a notebook page. */
const ruled = {
  backgroundColor: paper,
  backgroundImage:
    "linear-gradient(90deg, transparent 38px, rgba(224,86,122,0.35) 38px, rgba(224,86,122,0.35) 39px, transparent 39px), repeating-linear-gradient(transparent 0 27px, rgba(106,113,223,0.18) 27px 28px)",
};

/**
 * A diary whose cover opens with scroll. `open` goes 0 → 1:
 * the strap slides off, the cover swings left in 3D, and the journey entries
 * are written onto the right page one by one.
 */
export function Diary({ open, className = "" }: { open: MotionValue<number>; className?: string }) {
  const coverRotate = useTransform(open, [0.08, 1], [0, -178]);
  const strapX = useTransform(open, [0, 0.12], ["0%", "160%"]);
  const strapOpacity = useTransform(open, [0.06, 0.14], [1, 0]);
  const shadow = useTransform(open, [0, 1], [0.35, 0.18]);
  const boxShadow = useTransform(shadow, (a) => `0 40px 70px -25px rgba(0,0,0,${a})`);

  return (
    <div className={`relative [transform-style:preserve-3d] ${className}`}>
      {/* page edges peeking out behind */}
      <div aria-hidden className="absolute inset-y-2 right-[-6px] left-2 rounded-r-[16px] border border-black/5 bg-[#ebe4d6]" />
      <div aria-hidden className="absolute inset-y-1 right-[-3px] left-1 rounded-r-[16px] border border-black/5 bg-[#f1ebdf]" />

      {/* right page: the journey */}
      <motion.div style={{ ...ruled, boxShadow }} className="absolute inset-0 overflow-hidden rounded-r-[16px] rounded-l-[4px]">
        <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/10 to-transparent" />
        <div className="flex h-full flex-col py-5 pr-4 pl-12 md:py-7 md:pr-6" style={{ color: ink }}>
          <p className="hand text-[26px] leading-none md:text-[34px]">My journey</p>
          <ol className="mt-3 flex-1 space-y-[6px] md:mt-5 md:space-y-3">
            {diary.entries.map((e, i) => (
              <Entry key={e.year} open={open} index={i} total={diary.entries.length} {...e} />
            ))}
          </ol>
          <Line open={open} at={0.97} className="hand text-[17px] text-[#4a50c4] md:text-[22px]">
            {diary.next}
          </Line>
        </div>
      </motion.div>

      {/* cover: front face + inside face */}
      <motion.div
        style={{ rotateY: coverRotate, transformOrigin: "left center" }}
        className="absolute inset-0 [transform-style:preserve-3d]"
      >
        {/* front */}
        <div
          className="absolute inset-0 overflow-hidden rounded-r-[16px] rounded-l-[6px] [backface-visibility:hidden]"
          style={{
            background: "radial-gradient(120% 90% at 30% 10%, #3a3d6b 0%, #23244a 55%, #17182f 100%)",
            boxShadow: "inset 6px 0 10px rgba(0,0,0,0.35), inset -1px 0 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* spine */}
          <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/40 via-white/5 to-transparent" />
          {/* stitching */}
          <div className="absolute inset-3 rounded-r-[10px] rounded-l-[2px] border border-dashed border-[#e8d5a3]/35" />
          {/* leather grain */}
          <div
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* label tag */}
          <div className="absolute top-6 right-6 rotate-[3deg] rounded-[4px] bg-[#f3ead6] px-3 py-1.5 text-center shadow-md md:top-8 md:right-8">
            <p className="display text-[11px] tracking-[0.2em] text-[#8a6d3b] md:text-[13px]">{diary.volume}</p>
            <p className="hand text-[15px] leading-none text-[#2b2a33] md:text-[18px]">{diary.years}</p>
          </div>

          {/* taped polaroid */}
          <div className="absolute top-[22%] left-[18%] -rotate-[6deg] bg-white p-2 pb-6 shadow-lg md:p-2.5 md:pb-8">
            <div className="absolute -top-2 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[4deg] bg-[#f6e7b6]/80" />
            <Portrait caption={false} className="h-[86px] w-[72px] rounded-none md:h-[120px] md:w-[100px]" />
            <p className="hand absolute right-0 bottom-1 left-0 text-center text-[13px] text-[#2b2a33] md:bottom-1.5 md:text-[16px]">
              that&apos;s me
            </p>
          </div>

          {/* title */}
          <div className="absolute right-6 bottom-12 left-8 md:right-8 md:bottom-16 md:left-10">
            <p className="display text-[30px] leading-[0.95] font-bold text-[#e8d5a3] drop-shadow-[0_1px_0_rgba(0,0,0,0.6)] md:text-[46px]">
              My
              <br />
              Journey
            </p>
            <p className="mt-2 text-[10px] tracking-[0.25em] text-[#e8d5a3]/60 uppercase md:text-xs">{profile.name}</p>
          </div>

          {/* bookmark ribbon */}
          <div className="absolute right-14 -bottom-1 h-8 w-4 bg-[#e0567a] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)]" />

          {/* elastic strap */}
          <motion.div
            style={{ x: strapX, opacity: strapOpacity }}
            className="absolute inset-y-0 right-7 w-3 bg-gradient-to-r from-[#5b62d6] to-[#454bb3] shadow-[0_0_6px_rgba(0,0,0,0.4)]"
          />
        </div>

        {/* inside of the cover = left page */}
        <div
          className="absolute inset-0 overflow-hidden rounded-l-[16px] rounded-r-[4px] [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{ backgroundColor: paper, color: ink }}
        >
          <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-black/10 to-transparent" />
          <div className="flex h-full flex-col justify-between p-5 md:p-8">
            <div>
              <p className="hand text-[17px] text-black/65 md:text-[22px]">This diary belongs to</p>
              <p className="hand mt-1 text-[26px] leading-none md:text-[36px]">{profile.name}</p>
              <div className="mt-2 h-px w-3/4 bg-black/20" />
              <p className="hand mt-2 text-[15px] text-black/65 md:text-[19px]">{profile.location}</p>
            </div>
            <div>
              <svg viewBox="0 0 120 60" className="h-10 w-20 text-[#e0567a] md:h-14 md:w-28" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                <path d="M10 40 C 30 10, 50 10, 60 35 S 95 55, 110 20" />
                <path d="M102 16 l8 4 l-3 9" />
              </svg>
              <p className="hand text-[19px] leading-tight md:text-[26px]">&ldquo;{diary.motto}&rdquo;</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Entry({
  open,
  index,
  total,
  year,
  title,
  note,
}: {
  open: MotionValue<number>;
  index: number;
  total: number;
  year: string;
  title: string;
  note: string;
}) {
  const start = 0.55 + (index / total) * 0.38;
  const opacity = useTransform(open, [start, start + 0.08], [0, 1]);
  const x = useTransform(open, [start, start + 0.08], [-8, 0]);
  return (
    <motion.li style={{ opacity, x }} className="flex gap-3">
      <span className="hand w-10 shrink-0 text-[17px] leading-tight font-bold text-[#e0567a] md:w-12 md:text-[22px]">{year}</span>
      <span className="min-w-0">
        <span className="hand block text-[17px] leading-tight md:text-[22px]">{title}</span>
        <span className="block truncate text-[9px] leading-snug text-black/60 md:text-[11px]">{note}</span>
      </span>
    </motion.li>
  );
}

function Line({ open, at, className, children }: { open: MotionValue<number>; at: number; className?: string; children: React.ReactNode }) {
  const opacity = useTransform(open, [at - 0.04, at], [0, 1]);
  return (
    <motion.p style={{ opacity }} className={className}>
      {children}
    </motion.p>
  );
}
