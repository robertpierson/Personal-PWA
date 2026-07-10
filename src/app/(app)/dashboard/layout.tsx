import { requireSession } from "@/lib/auth";
import { getCreditsUsage, getNotifications } from "@/lib/data/dashboard";
import { Sidebar, type NavItem } from "@/components/dashboard/sidebar";
import { NotificationsMenu } from "@/components/dashboard/notifications-menu";
import { CreditsMenu } from "@/components/dashboard/credits-menu";

const ownerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Content calendar", href: "/dashboard/calendar", icon: "calendar" },
  { label: "Designs", href: "/dashboard/designs", icon: "designs" },
  { label: "Deliverables", href: "/dashboard/deliverables", icon: "deliverables" },
  { label: "Insights", href: "/dashboard/insights", icon: "insights" },
  { label: "Invoices", href: "/dashboard/invoices", icon: "invoices" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

// Workers get a limited, metrics-focused view (no designs, deliverables, or
// invoices — see the tenancy/roles decision). Settings is included for
// everyone since it now also holds personal, per-device preferences
// (theme, notifications) — the business-sensitive panels inside it
// (organization, connected accounts, team access) are still gated to
// owners at the page level.
const workerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Content calendar", href: "/dashboard/calendar", icon: "calendar" },
  { label: "Insights", href: "/dashboard/insights", icon: "insights" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const isOwner = session.member.role === "owner";
  const nav = isOwner ? ownerNav : workerNav;

  const [notifications, credits] = await Promise.all([
    getNotifications(session),
    isOwner ? getCreditsUsage(session) : Promise.resolve(null),
  ]);

  return (
    <div className="min-h-full bg-paper text-ink" data-app-theme>
      {/* Applies the stored theme before first paint, avoiding a flash of
          the wrong theme. Scoped to this wrapper only (via data-app-theme),
          never the marketing site — see globals.css. */}
      <script
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var t=localStorage.getItem('meridian-theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d)document.currentScript.parentElement.setAttribute('data-theme','dark');}catch(e){}})();",
        }}
      />
      <Sidebar session={session} nav={nav} />
      <div className="lg:pl-72">
        {session.demo && (
          <div className="bg-forest px-4 py-2 text-center text-xs font-medium text-paper">
            Demo mode — sample data. Add Supabase credentials to go live.
          </div>
        )}
        <div className="flex items-center justify-end gap-3 border-b border-line px-4 py-3 sm:px-8">
          {credits && <CreditsMenu summary={credits} />}
          <NotificationsMenu initial={notifications} />
        </div>
        <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
