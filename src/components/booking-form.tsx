"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

const orgTypes = [
  "Nonprofit / community org",
  "PTA / school foundation",
  "Youth sports league",
  "Local business",
  "Other",
];

const timeframes = [
  "As soon as possible",
  "Within a few weeks",
  "This quarter",
  "Just exploring",
];

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-panel px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    // Honeypot — bots fill hidden fields; humans don't.
    if (data.company) {
      setStatus("success");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-forest/25 bg-forest px-7 py-12 text-paper">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-paper/15">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M4 11.5l4.5 4.5L18 6"
              stroke="var(--color-gold-soft)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-6 font-serif text-2xl">Request received.</h3>
        <p className="mt-3 max-w-md leading-relaxed text-paper/85">
          Thank you — we&apos;ll be in touch within one business day to find a
          time for your intro call. Keep an eye on your inbox.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-medium text-gold-soft underline underline-offset-4 hover:text-paper"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name
          </label>
          <input
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Jane Rivera"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@organization.org"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="organization" className={labelClass}>
            Organization
          </label>
          <input
            id="organization"
            name="organization"
            required
            placeholder="Riverside Arts Collective"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="orgType" className={labelClass}>
            Type of organization
          </label>
          <select id="orgType" name="orgType" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select one…
            </option>
            {orgTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className={labelClass}>
            Your role <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="role"
            name="role"
            placeholder="Board member, organizer, owner…"
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="instagram" className={labelClass}>
            Instagram handle <span className="text-ink-faint">(optional)</span>
          </label>
          <input
            id="instagram"
            name="instagram"
            placeholder="@yourorg"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="timeframe" className={labelClass}>
          Timeframe
        </label>
        <select
          id="timeframe"
          name="timeframe"
          className={fieldClass}
          defaultValue=""
        >
          <option value="" disabled>
            When are you hoping to start?
          </option>
          {timeframes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="goals" className={labelClass}>
          What would a stronger presence unlock for you?
        </label>
        <textarea
          id="goals"
          name="goals"
          rows={4}
          placeholder="A grant deadline, a sponsorship push, looking credible for the next season…"
          className={`${fieldClass} resize-y`}
        />
      </div>

      {status === "error" && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="sm:w-auto"
        >
          {status === "submitting" ? "Sending…" : "Request intro call"}
        </Button>
        <p className="text-xs leading-relaxed text-ink-faint">
          No obligation. We reply within one business day.
        </p>
      </div>
    </form>
  );
}
