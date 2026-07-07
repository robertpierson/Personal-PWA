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

// Workers get a limited, metrics-focused view (no designs, deliverables,
// invoices, or settings) — see the tenancy/roles decision.
const workerNav: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "overview" },
  { label: "Content calendar", href: "/dashboard/calendar", icon: "calendar" },
  { label: "Insights", href: "/dashboard/insights", icon: "insights" },
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
    <div className="min-h-full bg-paper">
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
