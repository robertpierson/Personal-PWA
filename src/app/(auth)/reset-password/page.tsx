import type { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { isSupabaseConfigured } from "@/lib/config";

export const metadata: Metadata = { title: "Set new password" };

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-[calc(var(--radius-card)+4px)] border border-line bg-panel p-7 sm:p-9">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-ink">
          Set a new password
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Choose a new password for your account.
        </p>
        <div className="mt-7">
          <ResetPasswordForm demoMode={!isSupabaseConfigured} />
        </div>
      </div>
    </div>
  );
}
