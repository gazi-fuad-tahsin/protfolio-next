import Link from "next/link";
import { NavLink } from "@/components/ui/NavLink";
import { ArrowUpRight, DownloadIcon, socialIcon } from "@/components/ui/Icons";
import { profile } from "@/lib/data";
import { L } from "@/components/ui/L";

const nav = [
  { href: "/", label: "Home", k: "nav.home" },
  { href: "/about", label: "About", k: "nav.about" },
  { href: "/projects", label: "Projects", k: "nav.projects" },
  { href: "/blogs", label: "Blogs", k: "nav.blogs" },
  { href: "/#contact", label: "Contact", k: "nav.contact" },
];

export function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden rounded-t-[32px] bg-ink text-ink-fg dark:border-t dark:border-line">
      <div className="container-page pt-16 md:pt-24">
        {/* CTA */}
        <div className="flex flex-col justify-between gap-8 border-b border-white/10 pb-12 md:flex-row md:items-end">
          <div>
            <p className="flex items-center gap-2 text-sm text-white/60">
              <span className="h-2 w-2 rounded-full bg-[#27d974] shadow-[0_0_0_4px_rgba(39,217,116,0.2)]" />
              {profile.available ? <L k="footer.available">Available for new projects &amp; roles</L> : <L k="nav.busy">Currently busy</L>}
            </p>
            <h2 className="display mt-4 text-[48px] font-bold md:text-[80px]">
              <L k="footer.cta1">Have a project</L>
              <br />
              <span className="lang-en">
                in <span className="text-accent-on-ink">mind?</span>
              </span>
              <span className="lang-bn text-accent-on-ink">
                <L k="footer.cta2">in mind?</L>
              </span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="display group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-xl text-accent-fg transition-transform hover:-translate-y-0.5"
            >
              <L k="footer.talk">Let&apos;s talk</L> <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
            </Link>
            <a
              href={profile.resume}
              download
              className="display inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-3 text-xl transition-colors hover:border-white"
            >
              <L k="footer.resume">Resume</L> <DownloadIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs tracking-wider text-white/50 uppercase">
              <L k="footer.email">Email</L>
            </p>
            <a href={`mailto:${profile.email}`} className="mt-2 block break-all hover:text-accent-on-ink">
              {profile.email}
            </a>
          </div>
          <div>
            <p className="text-xs tracking-wider text-white/50 uppercase">
              <L k="footer.call">Call</L>
            </p>
            <a href={`tel:${profile.phone}`} className="mt-2 block hover:text-accent-on-ink">
              {profile.phone}
            </a>
            <p className="mt-1 text-sm text-white/50">{profile.location}</p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-white/50 uppercase">
              <L k="footer.pages">Pages</L>
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1">
              {nav.map((l) => (
                <li key={l.href}>
                  <NavLink href={l.href} className="hover:text-accent-on-ink">
                    <L k={l.k}>{l.label}</L>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs tracking-wider text-white/50 uppercase">
              <L k="footer.social">Social</L>
            </p>
            <div className="mt-3 flex gap-2">
              {profile.socials.map((s) => {
                const Icon = socialIcon[s.name];
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {profile.name}. <L k="footer.rights">All rights reserved.</L>
          </p>
          <p>
            <L k="footer.built">{`Built with Next.js · Designed & developed by ${profile.shortName}`}</L>
          </p>
        </div>
      </div>

      {/* Giant name (decorative) */}
      <svg aria-hidden viewBox="0 0 1000 230" className="pointer-events-none -mb-2 block w-full select-none">
        <text
          x="500"
          y="225"
          textAnchor="middle"
          fill="currentColor"
          fillOpacity="0.04"
          style={{ font: "700 260px var(--font-antonio)", textTransform: "uppercase" }}
        >
          {profile.shortName.toUpperCase()}
        </text>
      </svg>
    </footer>
  );
}
