import type { Metadata } from "next";
import { Services } from "@/components/sections/Services";
import { AboutTerminal } from "@/components/sections/AboutTerminal";
import { Contact } from "@/components/sections/Contact";
import { Cover } from "@/components/ui/Cover";
import { Reveal } from "@/components/ui/Motion";
import { Portrait } from "@/components/ui/Portrait";
import { LogoWall } from "@/components/ui/LogoWall";
import { TechLogo } from "@/components/ui/TechLogo";
import { PillAnchor, SectionHeading, Socials } from "@/components/ui/Primitives";
import { DownloadIcon } from "@/components/ui/Icons";
import { about, profile } from "@/lib/data";
import { L } from "@/components/ui/L";

export const metadata: Metadata = {
  title: "About",
  description: profile.aboutLong[0],
  alternates: { canonical: "/about" },
};

const art = {
  planning: { image: "/images/process/planning.svg", from: "#1f0a22", to: "#c2416a", pattern: "wave" },
  build: { image: "/images/process/code-review.svg", from: "#14122b", to: "#5b62d6", pattern: "grid" },
  deploy: { image: "/images/process/monitoring.svg", from: "#0b0b0e", to: "#3a3a48", pattern: "prism" },
} as const;

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="container-page grid min-h-[100svh] items-center gap-12 pt-32 pb-16 md:grid-cols-2">
        <Reveal>
          <h1 className="display text-[56px] font-bold sm:text-[80px] lg:text-[120px]">
            <L k="about.title">About me</L>
          </h1>
          <p className="display mt-6 text-[28px]">{profile.name}</p>
          {profile.aboutLong.map((p, i) => (
            <p key={p} className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">
              <L k={`about.long.${i}`}>{p}</L>
            </p>
          ))}
          <Socials className="mt-8" />
          <PillAnchor href={profile.resume} download className="mt-8">
            <L k="nav.downloadCv">Download CV</L> <DownloadIcon className="h-4 w-4" />
          </PillAnchor>
        </Reveal>
        <Reveal delay={0.15} className="mx-auto md:mr-0">
          <Portrait priority className="h-[420px] w-[300px] md:h-[480px] md:w-[340px]" />
        </Reveal>
      </section>

      <AboutTerminal />

      <Services />

      {/* Journey */}
      <section className="container-page grid items-center gap-12 py-24 md:grid-cols-2 md:py-32">
        <div>
          <Reveal>
            <SectionHeading
              i18n="about.journey"
              title="Discover My Journey in Engineering"
              intro="From competitive programming at university to leading a mobile app team — my path has been shaped by a love for building reliable systems and helping teams ship them."
            />
          </Reveal>
          <div className="mt-10">
            {about.experience.map((e, i) => (
              <Reveal key={e.role + e.company} delay={i * 0.06}>
                <div className="flex items-center justify-between gap-6 border-b border-line py-5">
                  <p className="display text-[22px] md:text-[24px]">{e.role}</p>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-accent">{e.company}</p>
                    <p className="text-xs text-muted">{e.period}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <Reveal delay={0.15} className="mx-auto md:mr-0">
          <LogoWall className="h-[420px] w-[300px] md:h-[480px] md:w-[340px]" />
        </Reveal>
      </section>

      {/* Tech stack */}
      <section className="container-page grid items-start gap-12 py-24 md:grid-cols-2 md:py-32">
        <Reveal className="md:sticky md:top-28">
          <SectionHeading
            i18n="about.stack"
            title="My Tech Stack"
            intro="I build with intention. Node.js and TypeScript for solid APIs, Next.js for clean interfaces, Flutter for mobile, and battle-tested services for payments and real-time."
          />
        </Reveal>
        <div>
          {about.stack.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <div className="group flex items-center gap-5 border-b border-line py-5">
                <span className="flex shrink-0 -space-x-2">
                  {t.icons.map((icon) => (
                    <span
                      key={icon}
                      className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-bg shadow-[0_4px_14px_rgba(0,0,0,0.06)] transition-transform duration-300 group-hover:-translate-y-1 [&:nth-child(2)]:delay-75"
                    >
                      <TechLogo name={icon} className="h-6 w-6" />
                    </span>
                  ))}
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    <L k={`about.stack.${i}`}>{t.desc}</L>
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="container-page py-24 md:py-32">
        <Reveal>
          <SectionHeading
            i18n="about.process"
            title="Engineering with Strategy and Craft"
            intro="My process blends planning and hands-on engineering to turn requirements into secure, scalable software — and keep it running after launch."
          />
        </Reveal>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProcessCard i={0} tone="ink" />
          <Reveal delay={0.05}>
            <Cover cover={art.planning} label="Requirements and sprint planning" className="h-full min-h-[260px] rounded-[20px]" />
          </Reveal>
          <ProcessCard i={1} tone="accent" />
          <Reveal>
            <Cover cover={art.build} label="Code review" className="h-full min-h-[260px] rounded-[20px]" />
          </Reveal>
          <ProcessCard i={2} tone="surface" className="lg:col-span-2" />
          <ProcessCard i={3} tone="accent" />
          <ProcessCard i={4} tone="ink" />
          <Reveal delay={0.1}>
            <Cover cover={art.deploy} label="Deployment and uptime monitoring" className="h-full min-h-[260px] rounded-[20px]" />
          </Reveal>
        </div>
      </section>

      <Contact />
    </>
  );
}

function ProcessCard({ i, tone, className = "" }: { i: number; tone: "ink" | "accent" | "surface"; className?: string }) {
  const step = about.process[i];
  const tones = {
    ink: "bg-ink text-ink-fg",
    accent: "bg-accent text-accent-fg",
    surface: "bg-surface",
  };
  return (
    <Reveal delay={(i % 3) * 0.06} className={className}>
      <div className={`flex h-full min-h-[260px] flex-col justify-between rounded-[20px] p-7 ${tones[tone]}`}>
        <p className="display text-[48px]">0{i + 1}.</p>
        <div>
          <h3 className="display mt-6 text-[26px]">
            <L k={`about.process.${i}.title`}>{step.title}</L>
          </h3>
          <p className="mt-3 text-sm leading-relaxed opacity-75">
            <L k={`about.process.${i}.desc`}>{step.desc}</L>
          </p>
        </div>
      </div>
    </Reveal>
  );
}
