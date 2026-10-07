"use client";

import { useSyncExternalStore } from "react";

export type Lang = "en" | "bn";

function subscribe(cb: () => void) {
  const obs = new MutationObserver(cb);
  obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-lang"] });
  return () => obs.disconnect();
}

/** Current language on the client (English during SSR). */
export function useLang(): Lang {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.lang === "bn" ? "bn" : "en"),
    () => "en",
  );
}

export function setLang(next: Lang) {
  document.documentElement.dataset.lang = next;
  document.documentElement.lang = next;
  try {
    localStorage.setItem("lang", next);
  } catch {}
}


export function LangToggle({ className = "" }: { className?: string }) {
  const lang = useLang();
  return (
    <button
      type="button"
      onClick={() => setLang(lang === "bn" ? "en" : "bn")}
      aria-label={lang === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
      title={lang === "bn" ? "English" : "বাংলা"}
      className={`flex h-[34px] min-w-[34px] shrink-0 items-center justify-center rounded-full border border-line px-2 text-[13px] font-semibold text-fg transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {lang === "bn" ? "EN" : "বাং"}
    </button>
  );
}
