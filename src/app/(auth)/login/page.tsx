import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { enterDemo } from "@/app/(auth)/actions";
import { getSession } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/config";

export const metadata: Metadata = {
  title: "Client login",
  description: "Sign in to your Marquee client dashboard.",
};

export default async function LoginPage() {
  // Already signed in? Go straight to the dashboard.
  const session = await getSession();
  if (session) redirect("/dashboard");

  const demoMode = !isSupabaseConfigured;
  const enterOwner = enterDemo.bind(null, "owner");
  const enterWorker = enterDemo.bind(null, "worker");

  return (
    <div className="w-full max-w-md">
      <div className="rounded-[calc(var(--radius-card)+4px)] border border-line bg-panel p-7 sm:p-9">
        <p className="eyebrow">Client dashboard</p>
        <h1 className="mt-3 font-serif text-3xl tracking-tight text-ink">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Sign in to see your content calendar, designs, and insights.
        </p>

        <div className="mt-7">
          <LoginForm demoMode={demoMode} />
        </div>

        {demoMode && (
          <div className="mt-7 border-t border-line pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
              Preview without an account
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <form action={enterOwner} className="flex-1">
                <button
                  type="submit"
                  className="h-11 w-full rounded-full border border-line-strong bg-panel px-4 text-sm font-medium text-ink transition-colors hover:border-forest hover:text-forest"
                >
                  Enter as owner
                </button>
              </form>
              <form action={enterWorker} className="flex-1">
                <button
                  type="submit"
                  className="h-11 w-full rounded-full border border-line-strong bg-panel px-4 text-sm font-medium text-ink transition-colors hover:border-forest hover:text-forest"
                >
                  Enter as team member
                </button>
              </form>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-ink-faint">
              Demo mode uses sample data — no account needed. Add Supabase
              credentials to enable real sign-in.
            </p>
          </div>
        )}
      </div>

      <p className="mt-5 text-center text-sm text-ink-soft">
        Not a client yet?{" "}
        <a href="/contact" className="font-medium text-forest hover:underline">
          Book an intro call
        </a>
      </p>
      <p className="mt-2 text-center text-xs text-ink-faint">
        <a href="/admin" className="hover:text-forest">
          Operator sign in →
        </a>
      </p>
    </div>
  );
}
