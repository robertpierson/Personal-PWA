"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/app/(app)/dashboard/actions";
import type { Notification, NotificationCategory } from "@/lib/types";

const categoryIcon: Record<NotificationCategory, string> = {
  calendar: "🗓️",
  deliverable: "✅",
  invoice: "🧾",
  insights: "📊",
  system: "🔔",
};

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diffMs / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function NotificationsMenu({ initial }: { initial: Notification[] }) {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const unreadCount = items.filter((n) => !n.read).length;

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

  function handleSelect(n: Notification) {
    setItems((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
    );
    setOpen(false);
    startTransition(() => {
      markNotificationRead(n.id);
    });
  }

  function handleMarkAllRead() {
    setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    startTransition(() => {
      markAllNotificationsRead();
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={open}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-line-strong text-ink-soft transition-colors duration-200 hover:border-forest hover:text-forest"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="shadow-lift absolute right-0 z-50 mt-2 w-80 rounded-[var(--radius-card)] border border-line bg-panel">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-serif text-base text-ink">Notifications</p>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="text-xs font-medium text-forest hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-96 divide-y divide-line overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-8 text-center text-sm text-ink-faint">
                You&apos;re all caught up.
              </li>
            )}
            {items.map((n) => (
              <li key={n.id}>
                <Link
                  href={n.href}
                  onClick={() => handleSelect(n)}
                  className={`flex gap-3 px-4 py-3 transition-colors duration-200 hover:bg-paper-2/60 ${
                    !n.read ? "bg-gold-soft/20" : ""
                  }`}
                >
                  <span className="text-lg" aria-hidden>
                    {categoryIcon[n.category]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-ink">
                        {n.title}
                      </span>
                      {!n.read && (
                        <span
                          aria-label="Unread"
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-forest"
                        />
                      )}
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-ink-soft">
                      {n.body}
                    </span>
                    <span className="mt-1 block text-xs text-ink-faint">
                      {relativeTime(n.createdAt)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
