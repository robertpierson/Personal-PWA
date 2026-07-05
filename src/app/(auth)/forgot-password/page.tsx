import type { Metadata } from "next";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-[calc(var(--radius-card)+4px)] border border-line bg-panel p-7 sm:p-9">
        <p className="eyebrow">Account</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-ink">
          Reset your password
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>
        <div className="mt-7">
          <ForgotPasswordForm />
        </div>
      </div>
      <p className="mt-5 text-center text-sm text-ink-soft">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-forest hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
