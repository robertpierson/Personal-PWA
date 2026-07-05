import Link from "next/link";
import { requireOperator } from "@/lib/operator";
import { Logo } from "@/components/logo";
import { signOut } from "@/app/(auth)/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const op = await requireOperator();

  return (
    <div className="min-h-full bg-paper">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-forest px-2.5 py-1 text-xs font-semibold text-paper">
              Operator
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/admin" className="text-ink-soft hover:text-forest">
              Clients
            </Link>
            <span className="hidden text-ink-faint sm:inline">{op.email}</span>
            <form action={signOut}>
              <button className="text-ink-soft hover:text-forest">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {op.demo && (
        <div className="bg-gold px-4 py-2 text-center text-xs font-medium text-ink">
          Demo mode — this admin is read-only. Add Supabase + a service-role key
          and set OPERATOR_EMAILS to manage real client data.
        </div>
      )}

      <main className="mx-auto w-full max-w-5xl px-5 py-8 sm:px-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
