import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { getCalendar } from "@/lib/data/dashboard";
import { PageHeader, StatusBadge } from "@/components/dashboard/primitives";
import type { CalendarItem } from "@/lib/types";

export const metadata: Metadata = { title: "Content calendar" };

const channelDot: Record<string, string> = {
  instagram: "bg-forest",
  facebook: "bg-[#3b5998]",
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

export default async function CalendarPage() {
  const session = await requireSession();
  const items = await getCalendar(session);
  const groups = groupByMonth(items);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Content calendar"
        description="Everything planned across your channels. Nothing publishes without your review."
      />

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
                    <p className="mt-1 text-[0.65rem] uppercase tracking-wide text-ink-faint">
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
  );
}
