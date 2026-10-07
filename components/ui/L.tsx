import type { ReactNode } from "react";
import bn from "@/data/bn.json";

const dict = bn as Record<string, string>;

/** Bangla text for a key (falls back to the given English). Useful for attributes. */
export function tBn(k: string, en: string) {
  return dict[k] ?? en;
}

/**
 * Bilingual text. Both versions are rendered; CSS shows the one matching
 * <html data-lang>, so it works in server components without a flash.
 */
export function L({ k, children }: { k: string; children: ReactNode }) {
  return (
    <>
      <span className="lang-en">{children}</span>
      <span className="lang-bn" lang="bn">
        {dict[k] ?? children}
      </span>
    </>
  );
}
