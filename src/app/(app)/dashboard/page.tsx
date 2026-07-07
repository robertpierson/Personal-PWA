import Link from "next/link";
import { requireSession } from "@/lib/auth";
import {
  getCalendar,
  getDeliverables,
  getInsights,
} from "@/lib/data/dashboard";
import {
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  formatDate,
} from "@/components/dashboard/primitives";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

function since(msAgo: number) {
  return new Date(Date.now() - msAgo);
}

export default async function OverviewPage() {
  const session = await requireSession();
  const isOwner = session.member.role === "owner";

  const [calendar, deliverables, insights] = await Promise.all([
    getCalendar(session),
    isOwner ? getDeliverables(session) : Promise.resolve([]),
    getInsights(session),
  ]);

  const cutoff = since(86_400_000);
  const upcoming = calendar
    .filter((c) => new Date(c.date) >= cutoff)
    .slice(0, 4);
  const activeDeliverables = deliverables.filter(
    (d) => d.status !== "delivered",
  ).length;
  const latest = insights.series.at(-1);
  const firstName = session.member.name.split(" ")[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description={`Here's where ${session.org.name} stands today.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Followers"
          value={insights.connection ? latest?.followers.toLocaleString() : "—"}
          sub={insights.connection ? "Growing steadily" : "Not connected"}
          accent
        />
        <StatCard
          label="Engagement"
          value={latest ? `${latest.engagementRate}%` : "—"}
          sub={latest ? "Latest weekly rate" : "Connect to see"}
        />
        <StatCard
          label="Next post"
          value={upcoming[0] ? formatDate(upcoming[0].date) : "—"}
          sub={upcoming[0]?.title ?? "Nothing scheduled"}
        />
        {isOwner && (
          <StatCard
            label="Active work"
            value={activeDeliverables}
            sub="Currently in progress"
          />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Upcoming content"
          action={
            <Link
              href="/dashboard/calendar"
              className="text-sm font-medium text-forest hover:underline"
            >
              View calendar
            </Link>
          }
        >
          <ul className="divide-y divide-line">
            {upcoming.length === 0 && (
              <li className="px-5 py-6 text-sm text-ink-faint">
                Nothing scheduled yet.
              </li>
            )}
            {upcoming.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-ink-faint">
                    {formatDate(item.date)} · {item.channel} · {item.format}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </Panel>

        {isOwner ? (
          <Panel
            title="Deliverables"
            action={
              <Link
                href="/dashboard/deliverables"
                className="text-sm font-medium text-forest hover:underline"
              >
                View all
              </Link>
            }
          >
            <ul className="divide-y divide-line">
              {deliverables.slice(0, 4).map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-4 px-5 py-4"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{d.title}</p>
                    <p className="text-xs text-ink-faint">
                      Due {formatDate(d.dueDate)}
                    </p>
                  </div>
                  <StatusBadge status={d.status} />
                </li>
              ))}
            </ul>
          </Panel>
        ) : (
          <Panel title="Your access">
            <div className="px-5 py-6 text-sm leading-relaxed text-ink-soft">
              You have a <strong className="text-ink">team member</strong> view
              — the content calendar and performance insights for{" "}
              {session.org.name}. For designs, deliverables, and billing, ask an
              account owner.
            </div>
          </Panel>
        )}
      </div>
    </div>
  );
}
