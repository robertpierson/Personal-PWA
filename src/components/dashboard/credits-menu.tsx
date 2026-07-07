"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { CreditsSummary } from "@/lib/data/dashboard";

function formatResetDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function CreditsMenu({ summary }: { summary: CreditsSummary }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pct = Math.min(
    100,
    Math.round((summary.usedCredits / summary.totalCredits) * 100),
  );
  const remaining = Math.max(0, summary.totalCredits - summary.usedCredits);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors duration-200 hover:border-forest hover:text-forest"
      >
        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-paper-2">
          <span
            className="block h-full rounded-full bg-forest"
            style={{ width: `${pct}%` }}
          />
        </span>
        {remaining.toLocaleString()} credits
      </button>

      {open && (
        <div className="shadow-lift absolute right-0 z-50 mt-2 w-72 rounded-[var(--radius-card)] border border-line bg-panel p-4">
          <div className="flex items-baseline justify-between">
            <p className="font-serif text-base text-ink">{summary.plan} plan</p>
            <p className="text-xs text-ink-faint">
              Resets {formatResetDate(summary.periodEnd)}
            </p>
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {summary.usedCredits.toLocaleString()} / {summary.totalCredits.toLocaleString()} credits used
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper-2">
            <div
              className="h-full rounded-full bg-forest transition-all duration-200"
              style={{ width: `${pct}%` }}
            />
          </div>

          <ul className="mt-4 space-y-2 border-t border-line pt-3 text-xs text-ink-soft">
            {summary.breakdown.map((item) => (
              <li key={item.key} className="flex items-center justify-between gap-2">
                <span className="truncate">
                  {item.qty > 1 ? `${item.qty}× ` : ""}
                  {item.label}
                </span>
                <span className="shrink-0 text-ink-faint">{item.credits} cr</span>
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            className="mt-4 block text-center text-sm font-medium text-forest hover:underline"
          >
            Need more? Compare plans →
          </Link>
        </div>
      )}
    </div>
  );
}
