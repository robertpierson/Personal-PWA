import type { PlanName } from "@/lib/types";

/**
 * Translates the plan features already shown on /pricing into a monthly
 * credit allowance — a Claude-style "credits per month" framing over the
 * exact same deliverables, not a new/different offering. Each plan's total
 * is computed from CREDIT_COSTS × the usage quantities in PLAN_USAGE below,
 * which mirror that tier's `features` list in src/content/site.config.ts, so the
 * credit total is always traceable back to what's actually included.
 */

export type CreditUsageKey =
  | "post"
  | "calendarManagement"
  | "insightsCheckIn"
  | "insightsReport"
  | "websiteHosting"
  | "brandSystem"
  | "eventsOutreach"
  | "priorityTurnaround"
  | "deepDiveReport";

/** Cost in credits for one unit of each service. */
export const CREDIT_COSTS: Record<CreditUsageKey, number> = {
  post: 15,
  calendarManagement: 50,
  insightsCheckIn: 20,
  insightsReport: 30,
  websiteHosting: 300,
  brandSystem: 200,
  eventsOutreach: 150,
  priorityTurnaround: 100,
  deepDiveReport: 50,
};

export const CREDIT_LABELS: Record<CreditUsageKey, string> = {
  post: "Designed social post",
  calendarManagement: "Monthly content calendar",
  insightsCheckIn: "Basic insights check-in",
  insightsReport: "Monthly insights report",
  websiteHosting: "Website, designed & hosted",
  brandSystem: "Full brand system & templates",
  eventsOutreach: "Community events & outreach support",
  priorityTurnaround: "Priority turnaround",
  deepDiveReport: "Quarterly deep-dive report",
};

type PlanUsage = Partial<Record<CreditUsageKey, number>>;

/** What each plan includes, as usage quantities — mirrors pricingTiers[].features. */
const PLAN_USAGE: Record<PlanName, PlanUsage> = {
  Free: { post: 1 },
  Basic: { post: 2, calendarManagement: 1, insightsCheckIn: 1 },
  Average: {
    post: 8,
    calendarManagement: 1,
    websiteHosting: 1,
    brandSystem: 1,
    insightsReport: 1,
  },
  Pro: {
    calendarManagement: 1,
    websiteHosting: 1,
    brandSystem: 1,
    insightsReport: 1,
    eventsOutreach: 1,
    priorityTurnaround: 1,
    deepDiveReport: 1,
  },
};

/** Pro's "unlimited post designs" — a generous flat pool rather than a literal count. */
const PRO_POST_POOL_CREDITS = 1120;

function usageCredits(usage: PlanUsage): number {
  return (Object.entries(usage) as [CreditUsageKey, number][]).reduce(
    (sum, [key, qty]) => sum + CREDIT_COSTS[key] * qty,
    0,
  );
}

export function creditsForPlan(plan: PlanName): number {
  const base = usageCredits(PLAN_USAGE[plan]);
  return plan === "Pro" ? base + PRO_POST_POOL_CREDITS : base;
}

export type CreditBreakdownItem = {
  key: CreditUsageKey;
  label: string;
  qty: number;
  credits: number;
};

/** Line-by-line breakdown of what a plan's monthly credits are made of. */
export function usageBreakdownForPlan(plan: PlanName): CreditBreakdownItem[] {
  const usage = PLAN_USAGE[plan];
  const items = (Object.entries(usage) as [CreditUsageKey, number][]).map(
    ([key, qty]) => ({
      key,
      label: CREDIT_LABELS[key],
      qty,
      credits: CREDIT_COSTS[key] * qty,
    }),
  );
  if (plan === "Pro") {
    items.unshift({
      key: "post",
      label: "Post designs (effectively unlimited)",
      qty: Math.round(PRO_POST_POOL_CREDITS / CREDIT_COSTS.post),
      credits: PRO_POST_POOL_CREDITS,
    });
  }
  return items;
}

export const PLAN_CREDITS: Record<PlanName, number> = {
  Free: creditsForPlan("Free"),
  Basic: creditsForPlan("Basic"),
  Average: creditsForPlan("Average"),
  Pro: creditsForPlan("Pro"),
};
