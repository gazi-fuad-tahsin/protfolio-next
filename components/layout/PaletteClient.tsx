"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setLang, useLang } from "./LangToggle";
import bn from "@/data/bn.json";

export type PaletteItem = {
  group: "pages" | "projects" | "posts" | "actions";
  label: string;
  bn?: string;
  hint?: string;
  href?: string;
  run?: () => void;
};

const dict = bn as Record<string, string>;
const groupKey = { pages: "palette.pages", projects: "palette.projects", posts: "palette.posts", actions: "palette.actions" };
const groupEn = { pages: "Pages", projects: "Projects", posts: "Articles", actions: "Actions" };

/** Open the palette from anywhere (e.g. the navbar search button). */
export function openPalette() {
  window.dispatchEvent(new Event("open-palette"));
}

export function PaletteClient({ items, email, resume }: { items: PaletteItem[]; email: string; resume: string }) {
  const router = useRouter();
  const lang = useLang();
  const t = (k: string, en: string) => (lang === "bn" ? (dict[k] ?? en) : en);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const actions: PaletteItem[] = useMemo(
    () => [
      {
        group: "actions",
        label: "Toggle dark mode",
        bn: dict["palette.theme"],
        run: () => {
          const root = document.documentElement;
          const next = root.dataset.theme === "dark" ? "light" : "dark";
          root.dataset.theme = next;
          try {
            localStorage.setItem("theme", next);
          } catch {}
        },
      },
      { group: "actions", label: "বাংলায় দেখুন", bn: dict["palette.lang"], run: () => setLang(lang === "bn" ? "en" : "bn") },
      {
        group: "actions",
        label: "Copy email address",
        bn: dict["palette.copyEmail"],
        hint: email,
        run: () => {
          navigator.clipboard?.writeText(email);
          setToast(lang === "bn" ? "ইমেইল কপি হয়েছে" : "Email copied");
        },
      },
      { group: "actions", label: "Download CV", bn: dict["palette.cv"], href: resume },
    ],
    [lang, email, resume],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const all = [...items, ...actions];
    if (!q) return all;
    return all.filter((i) => [i.label, i.bn, i.hint].some((s) => s?.toLowerCase().includes(q)));
  }, [items, actions, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  // global shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "/" && !open && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-palette", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-palette", onOpen);
    };
  }, [open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 1800);
    return () => clearTimeout(id);
  }, [toast]);

  // keep the highlighted row visible
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function choose(item: PaletteItem) {
    close();
    if (item.run) item.run();
    else if (item.href?.endsWith(".pdf")) window.open(item.href, "_blank");
    else if (item.href) router.push(item.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === "Escape") {
      close();
    }
  }

  let lastGroup = "";

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 px-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(e) => e.target === e.currentTarget && close()}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-full max-w-[560px] overflow-hidden rounded-[20px] border border-line bg-bg shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={onKeyDown}
                  placeholder={t("palette.placeholder", "Search pages, projects or articles…")}
                  aria-label="Search"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="palette-list"
                  aria-activedescendant={`palette-opt-${active}`}
                  className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
                />
                <kbd className="rounded-md border border-line px-1.5 py-0.5 text-[11px] text-muted">Esc</kbd>
              </div>

              <ul ref={listRef} id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
                {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">{t("palette.empty", "Nothing found.")}</li>}
                {results.map((item, i) => {
                  const header = item.group !== lastGroup;
                  lastGroup = item.group;
                  const label = lang === "bn" && item.bn ? item.bn : item.label;
                  return (
                    <li key={`${item.group}-${item.label}`} role="none">
                      {header && (
                        <p className="px-3 pt-3 pb-1 text-[11px] font-semibold tracking-wider text-muted uppercase">
                          {t(groupKey[item.group], groupEn[item.group])}
                        </p>
                      )}
                      <button
                        type="button"
                        id={`palette-opt-${i}`}
                        role="option"
                        aria-selected={i === active}
                        data-idx={i}
                        onMouseMove={() => setActive(i)}
                        onClick={() => choose(item)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] ${
                          i === active ? "bg-accent text-accent-fg" : "text-fg"
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        {item.hint && <span className={`shrink-0 text-xs ${i === active ? "opacity-80" : "text-muted"}`}>{item.hint}</span>}
                      </button>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-muted">
                <span>
                  <kbd className="rounded border border-line px-1">↑</kbd> <kbd className="rounded border border-line px-1">↓</kbd> navigate
                </span>
                <span>
                  <kbd className="rounded border border-line px-1">↵</kbd> open
                </span>
                <span className="ml-auto">
                  <kbd className="rounded border border-line px-1">Ctrl</kbd> + <kbd className="rounded border border-line px-1">K</kbd>
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.p
            role="status"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-ink px-4 py-2 text-sm text-ink-fg shadow-lg"
          >
            {toast}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  );
}
