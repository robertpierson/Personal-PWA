import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { getInsights } from "@/lib/data/dashboard";
import { isMetaConfigured } from "@/lib/config";
import { AreaChart } from "@/components/dashboard/area-chart";
import {
  PageHeader,
  Panel,
  StatCard,
  formatDate,
} from "@/components/dashboard/primitives";

export const metadata: Metadata = { title: "Insights" };

function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function InsightsPage() {
  const session = await requireSession();
  const insights = await getInsights(session);

  if (!insights.connection) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Instagram insights"
          description="Connect your Instagram Business account to see real reach, engagement, and growth."
        />
        <Panel>
          <div className="flex flex-col items-start gap-5 p-8">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-forest/10 text-forest">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h2 className="font-serif text-2xl text-ink">
                Connect your account
              </h2>
              <p className="mt-2 max-w-lg leading-relaxed text-ink-soft">
                We use Meta&apos;s official Graph API to read your insights —
                strictly read-only. We never post, follow, or take any action on
                your account. Metrics are tracked from the moment you connect
                onward.
              </p>
            </div>
            <a
              href="/api/instagram/connect"
              className="inline-flex h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-medium text-paper hover:bg-forest-deep"
            >
              Connect Instagram
            </a>
            {!isMetaConfigured && (
              <p className="text-xs text-ink-faint">
                Meta app credentials aren&apos;t configured yet — this button
                explains the setup rather than starting a live connection.
              </p>
            )}
          </div>
        </Panel>
      </div>
    );
  }

  const { series, connection } = insights;
  const latest = series.at(-1)!;
  const first = series[0];
  const labels = series.map((p) => shortDate(p.date));
  const followerGrowth = latest.followers - first.followers;
  const reachChange =
    first.reach > 0
      ? Math.round(((latest.reach - first.reach) / first.reach) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Instagram insights"
        description={`@${connection.username} · tracking since ${formatDate(connection.connectedAt)}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Followers"
          value={latest.followers.toLocaleString()}
          sub={`+${followerGrowth.toLocaleString()} since start`}
          accent
        />
        <StatCard
          label="Reach (weekly)"
          value={latest.reach.toLocaleString()}
          sub={`${reachChange >= 0 ? "+" : ""}${reachChange}% vs start`}
        />
        <StatCard
          label="Engagement"
          value={`${latest.engagementRate}%`}
          sub="Latest weekly rate"
        />
        <StatCard
          label="Profile views"
          value={latest.profileViews.toLocaleString()}
          sub="Weekly"
        />
      </div>

      <p className="text-xs leading-relaxed text-ink-faint">
        New to these terms? <strong className="text-ink-soft">Reach</strong> is
        how many different accounts saw your posts.{" "}
        <strong className="text-ink-soft">Engagement</strong> is how many of
        them liked, commented, or saved something, as a percent.{" "}
        <strong className="text-ink-soft">Profile views</strong> is how many
        people visited your Instagram profile page.
      </p>

      <Panel title="Followers over time">
        <div className="p-5">
          <AreaChart
            data={series.map((p) => p.followers)}
            labels={labels}
            color="var(--color-gold)"
          />
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Reach">
          <div className="p-5">
            <AreaChart
              data={series.map((p) => p.reach)}
              labels={labels}
              height={180}
            />
          </div>
        </Panel>
        <Panel title="Engagement rate">
          <div className="p-5">
            <AreaChart
              data={series.map((p) => p.engagementRate)}
              labels={labels}
              height={180}
              formatValue={(n) => `${n}%`}
            />
          </div>
        </Panel>
      </div>

      <p className="text-xs leading-relaxed text-ink-faint">
        Data is read from Meta&apos;s Graph API (read-only) and reported as-is.
        We don&apos;t inflate numbers or backfill history — the record begins
        when you connect.
      </p>
    </div>
  );
}
