"use client";

import { useActionState } from "react";
import { signIn, type AuthState } from "@/app/(auth)/actions";

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-panel px-4 py-3 text-ink placeholder:text-ink-faint transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

export function LoginForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    {},
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required={!demoMode}
          placeholder="you@organization.org"
          className={fieldClass}
        />
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-ink">
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-xs font-medium text-forest hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required={!demoMode}
          placeholder="••••••••"
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
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-medium text-paper transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
