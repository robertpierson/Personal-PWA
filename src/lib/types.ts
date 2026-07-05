/** Shared domain types for the client dashboard (Phases 2–4). */

export type Role = "owner" | "worker";

export type Org = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export type Member = {
  id: string;
  orgId: string;
  name: string;
  email: string;
  role: Role;
};

export type DeliverableStatus =
  | "not_started"
  | "in_progress"
  | "in_review"
  | "delivered";

export type Deliverable = {
  id: string;
  title: string;
  type: string;
  status: DeliverableStatus;
  dueDate: string; // ISO date
  description: string;
};

export type CalendarStatus =
  | "idea"
  | "drafting"
  | "scheduled"
  | "approved"
  | "published";

export type CalendarChannel = "instagram" | "facebook" | "newsletter" | "other";

export type CalendarItem = {
  id: string;
  date: string; // ISO date
  title: string;
  channel: CalendarChannel;
  format: "post" | "reel" | "story" | "carousel" | "email";
  status: CalendarStatus;
  caption: string;
};

export type Design = {
  id: string;
  title: string;
  type: string;
  status: "in_progress" | "delivered";
  createdAt: string;
  /** Public/signed URL to the asset; null while still a placeholder. */
  fileUrl: string | null;
  accent: "forest" | "gold" | "ink";
};

export type InvoiceStatus = "draft" | "open" | "paid" | "void";

export type Invoice = {
  id: string;
  number: string;
  description: string;
  amountCents: number;
  currency: string;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  hostedUrl: string | null;
};

export type InstagramConnection = {
  username: string;
  connectedAt: string;
  followersCount: number;
};

export type MetricPoint = {
  date: string; // ISO date
  reach: number;
  engagementRate: number; // percentage, e.g. 6.1
  followers: number;
  profileViews: number;
};

export type Insights = {
  connection: InstagramConnection | null;
  series: MetricPoint[];
};

/** The full context for a signed-in dashboard session. */
export type DashboardSession = {
  org: Org;
  member: Member;
  demo: boolean;
};
