/**
 * Placeholder portfolio / case-study content for Phase 1.
 * Replace `placeholder: true` entries with real engagements as they close.
 * Kept as plain data so it can later move to a CMS or Supabase without UI churn.
 */

export type CaseStudy = {
  slug: string;
  client: string;
  category: string;
  location: string;
  year: string;
  summary: string;
  challenge: string;
  work: string[];
  outcome: string;
  /** Stat cards shown on the case card. Keep to honest, organic-only metrics. */
  metrics: { label: string; value: string; note?: string }[];
  /** Placeholder swatch used in lieu of real imagery. */
  accent: "forest" | "gold" | "ink";
  placeholder: boolean;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "riverside-arts-collective",
    client: "Riverside Arts Collective",
    category: "Community nonprofit",
    location: "Westport, CT",
    year: "2025",
    summary:
      "A 40-year-old arts nonprofit that looked, online, like it had closed a decade ago.",
    challenge:
      "Grant reviewers and new families were finding an outdated feed and no consistent visual identity — undercutting a genuinely respected program.",
    work: [
      "Refreshed visual identity & post templates",
      "Quarterly content calendar tied to the season's programming",
      "Insights review cadence with the board",
    ],
    outcome:
      "A coherent, credible presence the board now links to directly in grant applications.",
    metrics: [
      { label: "Reach", value: "+3.4×", note: "90-day organic" },
      { label: "Engagement rate", value: "6.1%", note: "from 1.9%" },
      { label: "Posting", value: "Weekly", note: "from sporadic" },
    ],
    accent: "forest",
    placeholder: true,
  },
  {
    slug: "hillcrest-youth-soccer",
    client: "Hillcrest Youth Soccer",
    category: "Youth sports league",
    location: "Palo Alto, CA",
    year: "2025",
    summary:
      "A parent-run league that needed to look organized enough to attract sponsors.",
    challenge:
      "Registration and sponsorship pitches leaned on a feed that didn't reflect how well the league was actually run.",
    work: [
      "Season-long branded template kit",
      "Match-day & registration content calendar",
      "Sponsor-ready one-pager and highlights",
    ],
    outcome:
      "Two new local sponsors cited the league's presence as a reason they signed on.",
    metrics: [
      { label: "Reach", value: "+2.7×", note: "per-post average" },
      { label: "Saves", value: "+240%", note: "registration posts" },
      { label: "Sponsors", value: "+2", note: "this season" },
    ],
    accent: "gold",
    placeholder: true,
  },
  {
    slug: "north-end-food-pantry",
    client: "North End Food Pantry",
    category: "Local nonprofit",
    location: "Evanston, IL",
    year: "2024",
    summary:
      "A volunteer coalition that wanted donors to feel the professionalism behind the mission.",
    challenge:
      "An earnest but inconsistent feed made a well-run organization look smaller than it was.",
    work: [
      "Donor-facing brand system",
      "Monthly impact-report content calendar",
      "Volunteer spotlight series",
    ],
    outcome:
      "A steadier donor conversation and a presence the board is proud to share.",
    metrics: [
      { label: "Reach", value: "+2.1×", note: "90-day organic" },
      { label: "Profile visits", value: "+180%", note: "quarter over quarter" },
      { label: "Follower growth", value: "Steady", note: "quarter over quarter" },
    ],
    accent: "ink",
    placeholder: true,
  },
];
