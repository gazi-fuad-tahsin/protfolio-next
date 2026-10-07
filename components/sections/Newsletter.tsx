"use client";

import { useActionState, useEffect } from "react";
import { sendMessage } from "@/app/actions";
import { L } from "@/components/ui/L";

export function Newsletter() {
  const [state, action, pending] = useActionState(sendMessage, null);

  useEffect(() => {
    if (state?.status === "mailto" && state.mailto) window.location.href = state.mailto;
  }, [state]);

  return (
    <div className="mt-20 rounded-[20px] bg-accent p-8 text-accent-fg md:p-12">
      <h2 className="display text-[36px] md:text-[48px]"><L k="newsletter.title">Like what you see? There&apos;s more.</L>
      </h2>
      <p className="mt-3 max-w-[520px] text-sm opacity-85">
        <L k="newsletter.text">Get new engineering notes — backend, security and DevOps learnings — straight to your inbox.</L>
      </p>
      <form action={action} className="mt-6 flex max-w-[480px] flex-col gap-3 sm:flex-row">
        <input type="hidden" name="kind" value="newsletter" />
        <input
          name="email"
          type="email"
          required
          defaultValue={state?.values?.email}
          placeholder="you@example.com"
          aria-label="Email address"
          className="flex-1 rounded-full bg-accent-fg/15 px-5 py-3 text-sm outline-none placeholder:text-accent-fg/60 focus:ring-2 focus:ring-accent-fg/50"
        />
        <button
          type="submit"
          disabled={pending}
          className="display rounded-full bg-accent-fg px-6 py-3 text-lg text-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "…" : <L k="newsletter.subscribe">Subscribe</L>}
        </button>
      </form>
      {state && (
        <p role="status" className="mt-3 text-sm">
          {state.message}
        </p>
      )}
    </div>
  );
}
