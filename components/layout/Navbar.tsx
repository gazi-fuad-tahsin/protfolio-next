"use client";

import Link from "next/link";
import { NavLink } from "@/components/ui/NavLink";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { useState } from "react";
import { Avatar } from "@/components/ui/Portrait";
import { CloseIcon, DownloadIcon, MenuIcon } from "@/components/ui/Icons";
import profile from "@/data/profile.json";
import { ThemeToggle } from "./ThemeToggle";
import { LangToggle } from "./LangToggle";
import { openPalette } from "./PaletteClient";
import { L } from "@/components/ui/L";

function SearchButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={openPalette}
      aria-label="Search (Ctrl+K)"
      title="Search (Ctrl+K)"
      className={`flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-[17px] w-[17px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    </button>
  );
}

const morph = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;

const links = [
  { href: "/", label: "Home", k: "nav.home" },
  { href: "/about", label: "About", k: "nav.about" },
  { href: "/projects", label: "Projects", k: "nav.projects" },
  { href: "/blogs", label: "Blogs", k: "nav.blogs" },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 120));

  const expanded = !compact || hovered;

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      {/* Desktop: the link group folds away into an "Available for work" pill
          by animating real widths, so nothing overlaps mid-transition. */}
      <motion.nav
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{
          boxShadow: compact ? "0 10px 30px rgba(0,0,0,0.10)" : "0 6px 24px rgba(0,0,0,0.06)",
        }}
        transition={{ duration: 0.4 }}
        className="hidden items-center rounded-full border border-line bg-bg/85 p-1.5 backdrop-blur-md md:flex"
      >
        <NavLink href="/" aria-label="Home" className="shrink-0">
          <Avatar size={34} />
        </NavLink>

        {/* Status pill (compact) */}
        <motion.div
          initial={false}
          animate={{ width: expanded ? 0 : "auto", opacity: expanded ? 0 : 1 }}
          transition={morph}
          className="overflow-hidden"
          aria-hidden={expanded}
        >
          <span className="flex items-center gap-2 pr-3 pl-3 text-sm whitespace-nowrap text-muted">
            {profile.available ? <L k="nav.available">Available for work</L> : <L k="nav.busy">Currently busy</L>}
            <span
              className={`h-2 w-2 rounded-full ${profile.available ? "animate-pulse bg-[#27d974] shadow-[0_0_0_4px_rgba(39,217,116,0.2)]" : "bg-muted"}`}
            />
          </span>
        </motion.div>

        {/* Full links (expanded) */}
        <motion.div
          initial={false}
          animate={{ width: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={morph}
          className="overflow-hidden"
          aria-hidden={!expanded}
        >
          <div className="flex items-center gap-1 pl-2 whitespace-nowrap">
            <ul className="flex items-center gap-1 px-1 text-sm">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={false}
                  animate={{ y: expanded ? 0 : -6, opacity: expanded ? 1 : 0 }}
                  transition={{ duration: 0.3, delay: expanded ? 0.08 + i * 0.04 : 0 }}
                >
                  <NavLink
                    href={l.href}
                    tabIndex={expanded ? 0 : -1}
                    className={`rounded-full px-3 py-1.5 transition-colors hover:bg-surface hover:text-fg ${isActive(pathname, l.href) ? "text-fg" : "text-muted"}`}
                  >
                    <L k={l.k}>{l.label}</L>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            <a
              href={profile.resume}
              download
              tabIndex={expanded ? 0 : -1}
              aria-label="Download CV"
              className="flex h-[34px] items-center gap-1.5 rounded-full border border-line px-3 text-sm text-muted transition-colors hover:text-fg"
            >
              <DownloadIcon className="h-4 w-4" /> <L k="nav.cv">CV</L>
            </a>
            <Link
              href="/#contact"
              tabIndex={expanded ? 0 : -1}
              className="ml-1 rounded-full bg-ink px-6 py-2 text-sm text-ink-fg transition-opacity hover:opacity-85"
            >
              <L k="nav.contact">Contact</L>
            </Link>
          </div>
        </motion.div>

        {/* Always visible */}
        <div className="flex shrink-0 items-center gap-1.5 pl-2">
          <SearchButton />
          <LangToggle />
          <ThemeToggle />
        </div>
      </motion.nav>

      {/* Mobile */}
      <div className="w-full max-w-[420px] md:hidden">
        <div className="flex items-center justify-between rounded-full border border-line bg-bg/90 p-1.5 shadow-[0_6px_24px_rgba(0,0,0,0.06)] backdrop-blur">
          <NavLink href="/" className="flex items-center gap-2 text-sm text-muted">
            <Avatar size={36} />
            <span className="max-[360px]:hidden">
              {profile.available ? <L k="nav.available">Available for work</L> : <L k="nav.busy">Currently busy</L>}
            </span>
            <span className="h-2 w-2 rounded-full bg-[#27d974]" />
          </NavLink>
          <div className="flex items-center gap-1.5">
            <LangToggle className="h-10 min-w-10" />
            <ThemeToggle className="h-10 w-10" />
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-fg"
            >
              {menuOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="mt-2 overflow-hidden rounded-3xl border border-line bg-bg p-2 shadow-xl"
            >
              {[...links, { href: "/#contact", label: "Contact", k: "nav.contact" }].map((l) => (
                <li key={l.href}>
                  <NavLink
                    href={l.href}
                    onClick={() => setMenuOpen(false)}
                    className={`display block rounded-2xl px-4 py-3 text-2xl ${isActive(pathname, l.href) && l.href !== "/#contact" ? "text-accent" : ""}`}
                  >
                    <L k={l.k}>{l.label}</L>
                  </NavLink>
                </li>
              ))}
              <li>
                <a
                  href={profile.resume}
                  download
                  className="display flex items-center gap-2 rounded-2xl px-4 py-3 text-2xl"
                >
                  <L k="nav.downloadCv">Download CV</L> <DownloadIcon className="h-5 w-5" />
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    openPalette();
                  }}
                  className="display flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-left text-2xl"
                >
                  <L k="nav.search">Search</L>
                </button>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
