"use server";

import { profile } from "@/lib/data";

type Values = { name: string; email: string; service: string; message: string };

export type ContactState = {
  /** sent: delivered via Resend · mailto: open the visitor's email app · error: fix the form */
  status: "sent" | "mailto" | "error";
  message: string;
  mailto?: string;
  values?: Values;
} | null;

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function mailtoLink(subject: string, body: string) {
  return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Sends the contact / newsletter form.
 * With RESEND_API_KEY in .env.local the email is delivered directly; without it
 * the visitor's own email app opens with everything pre-filled, so no message
 * is ever lost.
 */
export async function sendMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values: Values = {
    name: String(formData.get("name") ?? "").trim().slice(0, 200),
    email: String(formData.get("email") ?? "").trim().slice(0, 200),
    service: String(formData.get("service") ?? "").trim().slice(0, 100),
    message: String(formData.get("message") ?? "").trim().slice(0, 5000),
  };
  const { name, email, service, message } = values;
  const kind = formData.get("kind") === "newsletter" ? "newsletter" : "contact";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: "error", message: "Please enter a valid email address.", values };
  }
  if (kind === "contact" && !name) {
    return { status: "error", message: "Please tell me your name.", values };
  }
  if (kind === "contact" && message.length < 10) {
    return { status: "error", message: "Please add a few words about your project (at least 10 characters).", values };
  }

  const subject =
    kind === "newsletter" ? `Subscribe me to updates` : `Portfolio enquiry from ${name}${service ? ` — ${service}` : ""}`;
  const text =
    kind === "newsletter"
      ? `Hi Tahsin, please add ${email} to your updates.`
      : `${message}\n\n—\nName: ${name}\nEmail: ${email}\nService: ${service || "-"}`;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      status: "mailto",
      message: "Your email app is opening with your message ready — just press Send.",
      mailto: mailtoLink(subject, text),
      values,
    };
  }

  const html =
    kind === "newsletter"
      ? `<p>${escape(email)} subscribed to updates.</p>`
      : `<p><b>Name:</b> ${escape(name)}<br/><b>Email:</b> ${escape(email)}<br/><b>Service:</b> ${escape(service || "-")}</p><p>${escape(message).replace(/\n/g, "<br/>")}</p>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM ?? "Portfolio <onboarding@resend.dev>",
        to: [profile.email],
        reply_to: email,
        subject,
        html,
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}`);
  } catch {
    // delivery failed — fall back to the visitor's email app rather than losing the message
    return {
      status: "mailto",
      message: "Couldn't send directly, so your email app is opening with the message ready.",
      mailto: mailtoLink(subject, text),
      values,
    };
  }

  return {
    status: "sent",
    message: kind === "newsletter" ? "You're subscribed — thanks!" : "Thanks! Your message is on its way — I'll get back to you soon.",
  };
}
