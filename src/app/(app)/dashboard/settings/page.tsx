import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { getInsights } from "@/lib/data/dashboard";
import {
  isMetaConfigured,
  isStripeConfigured,
  isSupabaseConfigured,
} from "@/lib/config";
import {
  PageHeader,
  Panel,
  formatDate,
} from "@/components/dashboard/primitives";
import { OrgSettingsForm } from "@/components/dashboard/org-settings-form";
import { NotificationPreferences } from "@/components/dashboard/notification-preferences";

export const metadata: Metadata = { title: "Settings" };

function IntegrationRow({
  name,
  status,
  detail,
  action,
}: {
  name: string;
  status: "connected" | "not_connected" | "demo";
  detail: string;
  action?: React.ReactNode;
}) {
  // "connected" reuses the muted/off-white "done" tone from the status-pill
  // system (see primitives.tsx) rather than gold, so it doesn't collide with
  // "demo" (attention) now that forest and gold are the same accent color.
  const dot =
    status === "connected"
      ? "bg-ink"
      : status === "demo"
        ? "bg-gold"
        : "bg-ink-faint";
  const statusLabel =
    status === "connected"
      ? "Connected"
      : status === "demo"
        ? "Demo mode"
        : "Not connected";
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
      <div className="flex items-start gap-3">
        <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden />
        <div>
          <p className="font-medium text-ink">
            {name} <span className="text-xs font-normal text-ink-faint">· {statusLabel}</span>
          </p>
          <p className="text-sm text-ink-soft">{detail}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

export default async function SettingsPage() {
  const session = await requireSession();
  const isOwner = session.member.role === "owner";

  // Only needed for the owner-only Connected accounts panel below.
  const insights = isOwner ? await getInsights(session) : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description={
          isOwner
            ? "Your preferences, organization, connected accounts, and team access."
            : "Your personal preferences for this dashboard."
        }
      />

      <Panel title="Notifications">
        <NotificationPreferences />
      </Panel>

      <Panel title="Account">
        <div className="divide-y divide-line">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-ink-soft">Name</span>
            <span className="font-medium text-ink">{session.member.name}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-ink-soft">Email</span>
            <span className="font-medium text-ink">{session.member.email}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-ink-soft">Role</span>
            <span className="font-medium capitalize text-ink">
              {session.member.role}
            </span>
          </div>
        </div>
      </Panel>

      {isOwner && (
        <>
          <Panel title="Organization">
            <OrgSettingsForm
              name={session.org.name}
              type={session.org.type}
              ownerEmail={session.member.email}
            />
          </Panel>

          <Panel title="Connected accounts">
            <div className="divide-y divide-line">
              <IntegrationRow
                name="Instagram Business"
                status={
                  insights?.connection
                    ? "connected"
                    : isMetaConfigured
                      ? "not_connected"
                      : "demo"
                }
                detail={
                  insights?.connection
                    ? `@${insights.connection.username} · since ${formatDate(insights.connection.connectedAt)}`
                    : "Read-only insights via Meta's official Graph API. We never post or act on your behalf."
                }
                action={
                  !insights?.connection && (
                    <a
                      href="/api/instagram/connect"
                      className="inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-sm font-medium text-ink hover:border-forest hover:text-forest"
                    >
                      Connect
                    </a>
                  )
                }
              />
              <IntegrationRow
                name="Billing (Stripe)"
                status={isStripeConfigured ? "connected" : "demo"}
                detail={
                  isStripeConfigured
                    ? "Payments are live via Stripe Checkout."
                    : "Add Stripe keys to accept invoice payments online."
                }
              />
            </div>
          </Panel>

          <Panel title="Team access">
            <div className="px-5 py-4 text-sm leading-relaxed text-ink-soft">
              Your account supports a full{" "}
              <strong className="text-ink">owner</strong> login plus limited{" "}
              <strong className="text-ink">team member</strong> logins that
              can see the content calendar and insights, but not designs,
              deliverables, or billing.
              {!isSupabaseConfigured && (
                <span className="mt-2 block text-xs text-ink-faint">
                  Team invitations become available once authentication is
                  configured. In demo mode you can preview the team-member
                  view by signing out and choosing “Enter as team member”.
                </span>
              )}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
