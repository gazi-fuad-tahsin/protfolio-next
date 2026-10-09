"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { TerminalClient, type TerminalData } from "@/components/sections/TerminalClient";

/** Open the terminal dialog from anywhere (navbar button, palette…). */
export function openTerminal() {
  window.dispatchEvent(new Event("open-terminal"));
}

export function TerminalModal({ data }: { data: TerminalData }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      // Ctrl/⌘ + ` toggles, like an editor's integrated terminal
      if ((e.ctrlKey || e.metaKey) && e.key === "`") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("open-terminal", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("open-terminal", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  // keep the page still behind the dialog
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 px-3 backdrop-blur-sm sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[860px]"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close terminal"
              className="absolute -top-11 right-0 flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur transition hover:bg-white/20"
            >
              Esc <span aria-hidden>✕</span>
            </button>
            <TerminalClient data={data} variant="modal" onNavigate={close} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
