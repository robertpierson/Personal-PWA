"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { contact, cta, icp } from "@/content/site.config";

type Status = "idle" | "submitting" | "success" | "error";

const timeframes = [
  "As soon as possible",
  "Within a few weeks",
  "This quarter",
  "Just exploring",
];

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-panel px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

const STEPS = ["You", "Organization", "Timing"] as const;

export function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  // Only the fields that gate progression need to be controlled.
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canContinue =
    step === 0 ? name.trim().length > 0 && emailValid : organization.trim().length > 0;

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
      <div className="rounded-[var(--radius-card)] border border-gold/30 bg-panel px-7 py-12">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-gold/15">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M4 11.5l4.5 4.5L18 6"
              stroke="var(--color-gold)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-6 font-serif text-2xl text-ink">{contact.successTitle}</h3>
        <p className="mt-3 max-w-md leading-relaxed text-ink-soft">
          {contact.successBody}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setStep(0);
          }}
          className="mt-6 text-sm font-medium text-gold underline underline-offset-4 hover:text-ink"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* Step indicator — goal-gradient: progress visibly close to done */}
      <div>
        <div className="flex items-center justify-between text-xs font-medium text-ink-faint">
          <span>
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </span>
          <span>{Math.round(((step + 1) / STEPS.length) * 100)}% done</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-2">
          <div
            className="h-full rounded-full bg-forest transition-all duration-200"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 1 — easiest, lowest-commitment fields first */}
      <div className={step === 0 ? "space-y-5" : "hidden"}>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      {/* Step 2 */}
      <div className={step === 1 ? "space-y-5" : "hidden"}>
        <div>
          <label htmlFor="organization" className={labelClass}>
            Organization
          </label>
          <input
            id="organization"
            name="organization"
            required
            placeholder="Riverside Arts Collective"
            value={organization}
            onChange={(e) => setOrganization(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="orgType" className={labelClass}>
            Type of organization <span className="text-ink-faint">(optional)</span>
          </label>
          <select id="orgType" name="orgType" className={fieldClass} defaultValue="">
            <option value="" disabled>
              Select one…
            </option>
            {icp.orgTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3 — nice-to-know, fully optional */}
      <div className={step === 2 ? "space-y-5" : "hidden"}>
        <div>
          <label htmlFor="timeframe" className={labelClass}>
            Timeframe <span className="text-ink-faint">(optional)</span>
          </label>
          <select id="timeframe" name="timeframe" className={fieldClass} defaultValue="">
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
            What would a stronger presence unlock for you?{" "}
            <span className="text-ink-faint">(optional)</span>
          </label>
          <textarea
            id="goals"
            name="goals"
            rows={4}
            placeholder="A grant deadline, a sponsorship push, looking credible for the next season…"
            className={`${fieldClass} resize-y`}
          />
        </div>
      </div>

      {status === "error" && (
        <p className="rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            className="rounded-full text-sm font-medium text-ink-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper-2"
          >
            ← Back
          </button>
        )}
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            size="lg"
            disabled={!canContinue}
            onClick={() => setStep((s) => s + 1)}
            className="sm:w-auto"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting"}
            className="sm:w-auto"
          >
            {status === "submitting" ? cta.primarySubmitting : cta.primary}
          </Button>
        )}
        <p className="text-xs leading-relaxed text-ink-faint">
          {contact.reassurance}
        </p>
      </div>
    </form>
  );
}
