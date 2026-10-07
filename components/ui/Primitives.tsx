import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { HandIcon, socialIcon } from "./Icons";
import profile from "@/data/profile.json";
import { L } from "./L";

export function Chip({ children, solid = false }: { children: ReactNode; solid?: boolean }) {
  return (
    <span
      className={
        solid
          ? "inline-flex rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-accent-fg"
          : "inline-flex rounded-full border border-accent px-2.5 py-0.5 text-[11px] text-accent"
      }
    >
      {children}
    </span>
  );
}

const pill =
  "display inline-flex items-center justify-center gap-2 rounded-full border border-accent px-6 py-2 text-lg text-accent transition-colors hover:bg-accent hover:text-accent-fg";

export function PillLink({ className = "", ...props }: ComponentProps<typeof Link>) {
  return <Link className={`${pill} ${className}`} {...props} />;
}

export function PillAnchor({ className = "", ...props }: ComponentProps<"a">) {
  return <a className={`${pill} ${className}`} {...props} />;
}

export function SectionHeading({ title, intro, i18n, className = "" }: { title: string; intro?: string; i18n?: string; className?: string }) {
  return (
    <div className={className}>
      <h2 className="display text-[42px] font-bold md:text-[56px]">{i18n ? <L k={`${i18n}.heading`}>{title}</L> : title}</h2>
      {intro && (
        <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">{i18n ? <L k={`${i18n}.intro`}>{intro}</L> : intro}</p>
      )}
    </div>
  );
}

export function HiBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`group relative flex h-[90px] w-[90px] items-center justify-center rounded-full bg-accent text-accent-fg shadow-lg ${className}`}
    >
      <span className="text-3xl transition-all duration-300 group-hover:scale-0 group-hover:opacity-0">Hi</span>
      <HandIcon className="absolute h-9 w-9 scale-0 opacity-0 transition-all duration-300 group-hover:rotate-[-15deg] group-hover:scale-100 group-hover:opacity-100" />
    </span>
  );
}

export function Socials({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {profile.socials.map((s) => {
        const Icon = socialIcon[s.name];
        return (
          <a key={s.name} href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="opacity-90 transition hover:-translate-y-0.5 hover:opacity-100">
            {Icon ? <Icon className="h-[18px] w-[18px]" /> : s.name}
          </a>
        );
      })}
    </div>
  );
}
