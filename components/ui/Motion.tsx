"use client";

import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "./Icons";

export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({ value, suffix = "", className = "" }: { value: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.6, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, mv, value]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export type AccordionItem = { title: ReactNode; content: ReactNode };

export function Accordion({
  items,
  numbered = true,
  defaultOpen = null,
  onChange,
  titleClassName = "text-[22px] md:text-[26px]",
}: {
  items: AccordionItem[];
  numbered?: boolean;
  defaultOpen?: number | null;
  onChange?: (i: number) => void;
  titleClassName?: string;
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen);

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i} className="border-b border-line">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                setOpen(isOpen ? null : i);
                if (!isOpen) onChange?.(i);
              }}
              className={`display flex w-full items-center justify-between gap-6 py-5 text-left ${titleClassName} ${isOpen ? "text-accent" : ""}`}
            >
              <span>
                {numbered && `${i + 1}. `}
                {item.title}
              </span>
              <ChevronDown className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-6 text-[15px] leading-relaxed text-muted">{item.content}</div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
