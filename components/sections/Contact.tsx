"use client";

import { useActionState, useEffect } from "react";
import { sendMessage } from "@/app/actions";
import { Reveal } from "@/components/ui/Motion";
import { Portrait } from "@/components/ui/Portrait";
import { HiBadge } from "@/components/ui/Primitives";
import { ArrowUpRight } from "@/components/ui/Icons";
import profile from "@/data/profile.json";
import { L, tBn } from "@/components/ui/L";
import { useLang } from "@/components/layout/LangToggle";

const field =
  "w-full rounded-2xl border border-line bg-surface/60 px-4 text-[15px] text-fg outline-none transition placeholder:text-muted/70 focus:border-accent focus:bg-bg focus:ring-4 focus:ring-accent/15";
const label = "mb-1.5 block text-[13px] font-medium";

const services = ["Backend / API", "Full Stack Web App", "Mobile App", "Consulting", "Hiring / Full-time"];

export function Contact() {
  const [state, action, pending] = useActionState(sendMessage, null);
  const v = state?.values;
  const bnMode = useLang() === "bn";
  const ph = (k: string, en: string) => (bnMode ? tBn(k, en) : en);
  // server messages are English; show the Bangla version for the common outcomes
  const statusText = state && bnMode && state.status !== "error" ? tBn(`contact.status.${state.status}`, state.message) : state?.message;

  // no email service configured (or it failed): hand off to the visitor's email app
  useEffect(() => {
    if (state?.status === "mailto" && state.mailto) window.location.href = state.mailto;
  }, [state]);

  return (
    <section id="contact" className="container-page grid scroll-mt-24 items-center gap-12 py-24 md:grid-cols-[0.8fr_1.2fr] md:py-32">
      <Reveal className="relative mx-auto hidden md:block">
        <Portrait className="h-[480px] w-[340px]" />
        <HiBadge className="absolute -bottom-8 -left-8" />
      </Reveal>

      <Reveal delay={0.1}>
        <h2 className="display text-[42px] font-bold md:text-[56px]">
          <L k="contact.heading">Let&apos;s work together</L>
        </h2>
        <p className="mt-4 max-w-[480px] text-[15px] leading-relaxed text-muted">
          <L k="contact.intro">Let&apos;s build something reliable together — whether it&apos;s your API, your product or your next big idea.</L>
        </p>

        <form
          action={action}
          className="mt-8 space-y-5 rounded-[24px] border border-line bg-bg/80 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-7"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className={label}>
                <L k="contact.name">Your name</L>
              </span>
              <input name="name" required autoComplete="name" defaultValue={v?.name} placeholder={ph("contact.namePh", "John Smith")} className={`${field} h-12`} />
            </label>
            <label className="block">
              <span className={label}>
                <L k="contact.email">Email</L>
              </span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={v?.email}
                placeholder="john@company.com"
                className={`${field} h-12`}
              />
            </label>
          </div>

          <fieldset>
            <legend className={label}>
              <L k="contact.need">What do you need?</L>
            </legend>
            <div className="flex flex-wrap gap-2">
              {services.map((s, si) => (
                <label key={s} className="cursor-pointer">
                  <input type="radio" name="service" value={s} defaultChecked={v?.service === s} className="peer sr-only" />
                  <span className="inline-flex items-center rounded-full border border-line bg-surface/60 px-3.5 py-2 text-[13px] text-muted transition peer-checked:border-accent peer-checked:bg-accent peer-checked:text-accent-fg peer-focus-visible:ring-4 peer-focus-visible:ring-accent/20 hover:border-accent hover:text-fg">
                    <L k={`contact.svc.${si}`}>{s}</L>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="block">
            <span className={label}>
              <L k="contact.message">Tell me about your project</L>
            </span>
            <textarea
              name="message"
              required
              minLength={10}
              rows={5}
              defaultValue={v?.message}
              placeholder={ph("contact.messagePh", "What are you building, and when do you need it?")}
              className={`${field} resize-y py-3 leading-relaxed`}
            />
          </label>

          {state && state.status !== "sent" && (
            <p
              role="status"
              className={`rounded-2xl px-4 py-3 text-sm ${
                state.status === "error" ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
              }`}
            >
              {statusText}
              {state.status === "mailto" && state.mailto && (
                <>
                  {" "}
                  <a href={state.mailto} className="font-semibold underline underline-offset-2">
                    <L k="contact.openAgain">Open it again</L>
                  </a>
                </>
              )}
            </p>
          )}
          {state?.status === "sent" && (
            <p role="status" className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
              {statusText}
            </p>
          )}

          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={pending}
              className="display group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-xl text-accent-fg shadow-[0_10px_30px_-10px_var(--accent)] transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
            >
              {pending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent-fg/30 border-t-accent-fg" />
                  <L k="contact.sending">Sending…</L>
                </>
              ) : (
                <>
                  <L k="contact.send">Send message</L>
                  <ArrowUpRight className="h-5 w-5 transition-transform group-hover:rotate-45" />
                </>
              )}
            </button>
            <p className="text-center text-[13px] text-muted sm:text-right">
              <L k="contact.orEmail">or email</L>{" "}
              <a href={`mailto:${profile.email}`} className="font-medium text-fg underline-offset-2 hover:underline">
                {profile.email}
              </a>
            </p>
          </div>
        </form>
      </Reveal>
    </section>
  );
}
