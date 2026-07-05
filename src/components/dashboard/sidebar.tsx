"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { signOut } from "@/app/(auth)/actions";
import type { DashboardSession } from "@/lib/types";

export type NavItem = { label: string; href: string; icon: string };

const icons: Record<string, React.ReactNode> = {
  overview: <path d="M3 3h7v7H3zM14 3h7v4h-7zM14 10h7v11h-7zM3 13h7v8H3z" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </>
  ),
  designs: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15l5-5 4 4 3-3 6 6" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </>
  ),
  deliverables: (
    <>
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  insights: <path d="M3 3v18h18M7 15l3-4 3 3 4-6" />,
  invoices: (
    <>
      <path d="M6 2h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
};

function Icon({ name }: { name: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

export function Sidebar({
  session,
  nav,
}: {
  session: DashboardSession;
  nav: NavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-forest text-paper"
                : "text-ink-soft hover:bg-paper-2 hover:text-ink"
            }`}
          >
            <Icon name={item.icon} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-3 lg:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-full border border-line-strong"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-paper px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-2">
          <Logo />
        </div>

        <div className="mt-6 rounded-xl border border-line bg-panel px-3 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">
            {session.org.type}
          </p>
          <p className="mt-0.5 truncate font-serif text-lg text-ink">
            {session.org.name}
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            {session.member.name} ·{" "}
            <span className="capitalize">{session.member.role}</span>
          </p>
        </div>

        <div className="mt-6 flex-1 overflow-y-auto">{links}</div>

        <form action={signOut} className="mt-4 border-t border-line pt-4">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-paper-2 hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Sign out
          </button>
        </form>
      </aside>

      {/* Mobile backdrop */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-30 bg-ink/30 lg:hidden"
        />
      )}
    </>
  );
}
