"use client";

import { useActionState } from "react";
import {
  requestPasswordReset,
  type ResetState,
} from "@/app/(auth)/actions";

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-panel px-4 py-3 text-ink placeholder:text-ink-faint focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

export function ForgotPasswordForm() {
  const [state, action, pending] = useActionState<ResetState, FormData>(
    requestPasswordReset,
    {},
  );

  if (state.sent) {
    return (
      <p className="rounded-lg border border-forest/25 bg-forest/5 px-4 py-3 text-sm text-forest">
        If an account exists for that email, a password-reset link is on its
        way. Check your inbox.
      </p>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@organization.org"
          className={fieldClass}
        />
      </div>
      {state.error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-medium text-paper hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
