"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-panel px-4 py-3 text-ink placeholder:text-ink-faint focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

/**
 * Updates the password for the user arriving via a Supabase recovery link.
 * The browser client picks up the recovery session from the URL automatically.
 */
export function ResetPasswordForm({ demoMode }: { demoMode: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = e.currentTarget;
    const password = String(new FormData(form).get("password") ?? "");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (demoMode) {
      setError("Password reset isn't available in demo mode.");
      return;
    }

    setStatus("saving");
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("idle");
      setError(error.message);
      return;
    }
    setStatus("done");
    setTimeout(() => router.push("/dashboard"), 1200);
  }

  if (status === "done") {
    return (
      <p className="rounded-lg border border-forest/25 bg-forest/5 px-4 py-3 text-sm text-forest">
        Password updated. Taking you to your dashboard…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="At least 8 characters"
          className={fieldClass}
        />
      </div>
      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "saving"}
        className="inline-flex h-11 w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-medium text-paper hover:bg-forest-deep disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : "Set new password"}
      </button>
    </form>
  );
}
