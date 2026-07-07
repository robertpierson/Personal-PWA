import type {
  CalendarItem,
  Deliverable,
  Design,
  DashboardSession,
  Insights,
  Invoice,
  MetricPoint,
  Notification,
  Org,
  Member,
} from "@/lib/types";

/**
 * Bundled demo dataset. Powers the dashboard when Supabase isn't configured so
 * the full Phase 2–4 experience is viewable with zero setup. Dates are computed
 * relative to "now" so the calendar and charts always look current.
 */

const DAY = 86_400_000;

function datetimeOffset(hoursAgo: number): string {
  return new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();
}

function isoOffset(days: number): string {
  return new Date(Date.now() + days * DAY).toISOString().slice(0, 10);
}

export const demoOrg: Org = {
  id: "demo-org",
  name: "Riverside Arts Collective",
  slug: "riverside-arts",
  type: "Community nonprofit",
  plan: "Average",
};

export const demoOwner: Member = {
  id: "demo-owner",
  orgId: demoOrg.id,
  name: "Jane Rivera",
  email: "jane@riversidearts.org",
  role: "owner",
};

export const demoWorker: Member = {
  id: "demo-worker",
  orgId: demoOrg.id,
  name: "Sam Okafor",
  email: "sam@riversidearts.org",
  role: "worker",
};

export function demoSession(role: "owner" | "worker" = "owner"): DashboardSession {
  return {
    org: demoOrg,
    member: role === "worker" ? demoWorker : demoOwner,
    demo: true,
  };
}

export const demoDeliverables: Deliverable[] = [
  {
    id: "d1",
    title: "Brand identity system",
    type: "Design",
    status: "delivered",
    dueDate: isoOffset(-24),
    description:
      "Logo refinement, color system, and type pairing with usage guidelines.",
  },
  {
    id: "d2",
    title: "Instagram post template kit",
    type: "Design",
    status: "delivered",
    dueDate: isoOffset(-10),
    description: "Ten reusable templates for announcements, events, and quotes.",
  },
  {
    id: "d3",
    title: "Q3 content calendar",
    type: "Strategy",
    status: "in_review",
    dueDate: isoOffset(3),
    description: "Twelve weeks mapped to summer programming and the fall gala.",
  },
  {
    id: "d4",
    title: "Summer gala announcement set",
    type: "Design",
    status: "in_progress",
    dueDate: isoOffset(9),
    description: "Carousel, story set, and a sponsor-facing one-pager.",
  },
  {
    id: "d5",
    title: "Volunteer spotlight series",
    type: "Content",
    status: "not_started",
    dueDate: isoOffset(21),
    description: "Six-part monthly series featuring long-time volunteers.",
  },
];

export const demoCalendar: CalendarItem[] = [
  {
    id: "c1",
    date: isoOffset(-2),
    title: "Season recap carousel",
    channel: "instagram",
    format: "carousel",
    status: "published",
    caption: "A look back at a remarkable spring season of programming.",
  },
  {
    id: "c2",
    date: isoOffset(1),
    title: "Gala save-the-date",
    channel: "instagram",
    format: "post",
    status: "approved",
    caption: "Mark your calendars — our annual gala returns this fall.",
  },
  {
    id: "c3",
    date: isoOffset(2),
    title: "Behind-the-scenes reel",
    channel: "instagram",
    format: "reel",
    status: "scheduled",
    caption: "Inside a week of rehearsals at the collective.",
  },
  {
    id: "c4",
    date: isoOffset(4),
    title: "Donor thank-you",
    channel: "instagram",
    format: "story",
    status: "drafting",
    caption: "A heartfelt thank-you to the donors making this season possible.",
  },
  {
    id: "c5",
    date: isoOffset(6),
    title: "July newsletter",
    channel: "newsletter",
    format: "email",
    status: "drafting",
    caption: "Monthly roundup: summer classes, gala news, volunteer spotlight.",
  },
  {
    id: "c6",
    date: isoOffset(9),
    title: "Volunteer spotlight #1",
    channel: "instagram",
    format: "post",
    status: "idea",
    caption: "Meet Marcus, who has volunteered with us for twelve years.",
  },
  {
    id: "c7",
    date: isoOffset(12),
    title: "Class registration open",
    channel: "instagram",
    format: "carousel",
    status: "idea",
    caption: "Fall class registration is now open — here's what's new.",
  },
];

export const demoDesigns: Design[] = [
  {
    id: "g1",
    title: "Primary logo lockup",
    type: "Identity",
    status: "delivered",
    createdAt: isoOffset(-24),
    fileUrl: null,
    accent: "forest",
  },
  {
    id: "g2",
    title: "Event announcement template",
    type: "Template",
    status: "delivered",
    createdAt: isoOffset(-14),
    fileUrl: null,
    accent: "gold",
  },
  {
    id: "g3",
    title: "Quote card template",
    type: "Template",
    status: "delivered",
    createdAt: isoOffset(-12),
    fileUrl: null,
    accent: "ink",
  },
  {
    id: "g4",
    title: "Gala carousel — draft",
    type: "Campaign",
    status: "in_progress",
    createdAt: isoOffset(-3),
    fileUrl: null,
    accent: "forest",
  },
  {
    id: "g5",
    title: "Sponsor one-pager",
    type: "Collateral",
    status: "in_progress",
    createdAt: isoOffset(-1),
    fileUrl: null,
    accent: "gold",
  },
  {
    id: "g6",
    title: "Story highlight covers",
    type: "Template",
    status: "delivered",
    createdAt: isoOffset(-8),
    fileUrl: null,
    accent: "ink",
  },
];

export const demoInvoices: Invoice[] = [
  {
    id: "i1",
    number: "MER-2026-014",
    description: "Monthly retainer — June",
    amountCents: 120000,
    currency: "usd",
    status: "paid",
    issuedDate: isoOffset(-34),
    dueDate: isoOffset(-20),
    hostedUrl: null,
  },
  {
    id: "i2",
    number: "MER-2026-018",
    description: "Brand identity system",
    amountCents: 250000,
    currency: "usd",
    status: "paid",
    issuedDate: isoOffset(-28),
    dueDate: isoOffset(-14),
    hostedUrl: null,
  },
  {
    id: "i3",
    number: "MER-2026-021",
    description: "Monthly retainer — July",
    amountCents: 120000,
    currency: "usd",
    status: "open",
    issuedDate: isoOffset(-4),
    dueDate: isoOffset(10),
    hostedUrl: null,
  },
];

function buildInsightsSeries(): MetricPoint[] {
  // 12 weekly points with a gently improving organic trend.
  const points: MetricPoint[] = [];
  let followers = 1420;
  for (let week = 11; week >= 0; week--) {
    const t = 11 - week;
    followers += 28 + Math.round(Math.sin(t) * 6) + t;
    points.push({
      date: isoOffset(-week * 7),
      reach: 2600 + t * 340 + (t % 2 === 0 ? 180 : 0),
      engagementRate: Number((3.4 + t * 0.24).toFixed(1)),
      followers,
      profileViews: 210 + t * 26,
    });
  }
  return points;
}

export const demoInsights: Insights = {
  connection: {
    username: "riversidearts",
    connectedAt: isoOffset(-84),
    followersCount: buildInsightsSeries().at(-1)!.followers,
  },
  series: buildInsightsSeries(),
};

/** An unconnected insights state, for demonstrating the connect flow. */
export const demoInsightsUnconnected: Insights = {
  connection: null,
  series: [],
};

export const demoNotifications: Notification[] = [
  {
    id: "n1",
    category: "invoice",
    title: "Invoice due soon",
    body: "MER-2026-021 ($1,200) is due in about a week.",
    href: "/dashboard/invoices",
    createdAt: datetimeOffset(2),
    read: false,
  },
  {
    id: "n2",
    category: "calendar",
    title: "Post approved",
    body: "“Gala save-the-date” was approved and is scheduled to post.",
    href: "/dashboard/calendar",
    createdAt: datetimeOffset(6),
    read: false,
  },
  {
    id: "n3",
    category: "insights",
    title: "Weekly insights are in",
    body: "Reach and engagement both grew again this week — take a look.",
    href: "/dashboard/insights",
    createdAt: datetimeOffset(20),
    read: false,
  },
  {
    id: "n4",
    category: "deliverable",
    title: "In review: Q3 content calendar",
    body: "Twelve weeks mapped to summer programming and the fall gala are ready for your review.",
    href: "/dashboard/deliverables",
    createdAt: datetimeOffset(30),
    read: true,
  },
  {
    id: "n5",
    category: "deliverable",
    title: "Design delivered",
    body: "Your Instagram post template kit (10 templates) is ready to use.",
    href: "/dashboard/designs",
    createdAt: datetimeOffset(72),
    read: true,
  },
  {
    id: "n6",
    category: "system",
    title: "Welcome to your dashboard",
    body: "This is where you'll track content, designs, deliverables, and billing.",
    href: "/dashboard",
    createdAt: datetimeOffset(200),
    read: true,
  },
];
