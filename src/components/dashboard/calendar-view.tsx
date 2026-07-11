"use client";

import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/dashboard/primitives";
import type { CalendarItem } from "@/lib/types";

// forest and gold both repoint to the one brand accent (see globals.css), so
// instagram can't use "bg-forest" here without becoming indistinguishable
// from the newsletter dot — bg-ink gives it its own neutral, legible color.
const channelDot: Record<string, string> = {
  instagram: "bg-ink",
  facebook: "bg-facebook",
  newsletter: "bg-gold",
  other: "bg-ink-faint",
};

function groupByMonth(items: CalendarItem[]) {
  const groups = new Map<string, CalendarItem[]>();
  for (const item of items) {
    const key = new Date(item.date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  return [...groups.entries()];
}

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

/** 6-week grid of dates covering the given month (padded with adjacent-month days). */
function buildMonthGrid(monthStart: Date) {
  const firstWeekday = monthStart.getDay();
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - firstWeekday);

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(gridStart);
    date.setDate(date.getDate() + i);
    return date;
  });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function CalendarView({ items }: { items: CalendarItem[] }) {
  const [mode, setMode] = useState<"list" | "grid">("list");
  const groups = useMemo(() => groupByMonth(items), [items]);

  const defaultMonth = useMemo(() => {
    const first = items[0] ? new Date(items[0].date) : new Date();
    return startOfMonth(first);
  }, [items]);
  const [viewMonth, setViewMonth] = useState(defaultMonth);

  const monthGrid = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const itemsByDay = useMemo(() => {
    const map = new Map<string, CalendarItem[]>();
    for (const item of items) {
      const key = new Date(item.date).toDateString();
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return map;
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="inline-flex rounded-full border border-line bg-panel p-1">
        <button
          type="button"
          onClick={() => setMode("list")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "list" ? "bg-forest text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          List
        </button>
        <button
          type="button"
          onClick={() => setMode("grid")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === "grid" ? "bg-forest text-paper" : "text-ink-soft hover:text-ink"
          }`}
        >
          Calendar
        </button>
      </div>

      {mode === "list" ? (
        <div className="space-y-8">
          {groups.length === 0 && (
            <p className="rounded-[var(--radius-card)] border border-dashed border-line bg-panel px-5 py-10 text-center text-sm text-ink-faint">
              No content planned yet.
            </p>
          )}

          {groups.map(([month, monthItems]) => (
            <div key={month}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-ink-faint">
                {month}
              </h2>
              <ul className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel">
                {monthItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col gap-3 border-b border-line px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 shrink-0 text-center">
                        <p className="font-serif text-xl leading-none text-ink">
                          {new Date(item.date).getDate()}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-wide text-ink-faint">
                          {new Date(item.date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-ink">{item.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-sm text-ink-soft">
                          {item.caption}
                        </p>
                        <div className="mt-1.5 flex items-center gap-2 text-xs text-ink-faint">
                          <span
                            className={`h-2 w-2 rounded-full ${channelDot[item.channel]}`}
                          />
                          <span className="capitalize">{item.channel}</span>
                          <span>·</span>
                          <span className="capitalize">{item.format}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pl-16 sm:pl-0">
                      <StatusBadge status={item.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[var(--radius-card)] border border-line bg-panel p-4 sm:p-5">
          <div className="flex items-center justify-between pb-4">
            <h2 className="font-serif text-lg tracking-tight text-ink">
              {viewMonth.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() =>
                  setViewMonth(
                    (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1),
                  )
                }
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-forest hover:text-forest"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={() => setViewMonth(startOfMonth(new Date()))}
                className="px-2 text-xs font-medium text-ink-soft transition-colors hover:text-forest"
              >
                Today
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={() =>
                  setViewMonth(
                    (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1),
                  )
                }
                className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink-soft transition-colors hover:border-forest hover:text-forest"
              >
                ›
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-[calc(var(--radius-card)-6px)] border border-line bg-line text-center text-xs font-semibold uppercase tracking-wide text-ink-faint">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="bg-paper-2/60 py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-b-[calc(var(--radius-card)-6px)] border-x border-b border-line bg-line">
            {monthGrid.map((date, i) => {
              const dayItems = itemsByDay.get(date.toDateString()) ?? [];
              const inMonth = date.getMonth() === viewMonth.getMonth();
              const today = isSameDay(date, new Date());
              return (
                <div
                  key={i}
                  className={`min-h-24 bg-panel p-1.5 sm:min-h-28 sm:p-2 ${
                    inMonth ? "" : "bg-paper-2/40"
                  }`}
                >
                  <p
                    className={`text-xs ${
                      today
                        ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-forest font-semibold text-paper"
                        : inMonth
                          ? "text-ink-soft"
                          : "text-ink-faint/60"
                    }`}
                  >
                    {date.getDate()}
                  </p>
                  <div className="mt-1 space-y-1">
                    {dayItems.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        title={`${item.title} (${item.channel})`}
                        className="flex items-center gap-1 truncate rounded-md bg-paper-2/70 px-1.5 py-1 text-xs text-ink"
                      >
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${channelDot[item.channel]}`}
                          aria-hidden
                        />
                        <span className="sr-only">{item.channel}: </span>
                        <span className="truncate">{item.title}</span>
                      </div>
                    ))}
                    {dayItems.length > 2 && (
                      <p className="px-1.5 text-xs text-ink-faint">
                        +{dayItems.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
