import type { PlanName } from "@/lib/types";

/**
 * Single source of truth for every string, number, and content list on the
 * marketing site — brand, hero, ICP, proof, pricing, FAQ, CTAs, contact copy.
 * No component should hard-code copy; everything reads from here so the
 * target market can be swapped (headline, outcome, proof, org types, pricing
 * framing) by editing this file, not by re-architecting components.
 *
 * `src/lib/site.ts`, `src/content/pricing.ts`, and `src/content/case-studies.ts`
 * now re-export from this file for backward compatibility with existing
 * imports — the data itself lives only here.
 */

export const brand = {
  name: "Meridian",
  wordmark: "Meridian",
  tagline: "Local Presence Studio",
  /** Short one-liner — footer, OG/meta description. */
  positioning:
    "More donors say yes. More volunteers show up. We run your website, social, and content calendar so your board doesn't have to.",
  /** Longer meta description. */
  description:
    "Meridian runs the website, hosting, social content, and content calendar for nonprofits, PTAs, youth leagues, and local businesses — so funders, sponsors, and volunteers see an organization that looks as credible as the work it does.",
  contactEmail: "hello@meridian.studio",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

/** The one promise, repeated verbatim everywhere. Do not vary this string. */
export const cta = {
  primary: "Book an intro call",
  primarySubmitting: "Booking…",
  primarySuccess: "Intro call booked",
  secondary: "See the work",
} as const;

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * ICP (ideal customer profile) for the current default configuration. Swap
 * this block — plus hero, proof, and pricing framing below — to retarget.
 */
export const icp = {
  label: "For nonprofits, PTAs, youth leagues & local businesses",
  orgTypes: [
    "Nonprofit",
    "For-profit business",
    "Startup",
    "Club or community group",
    "Other",
  ] as const,
  /** Used in the hero marquee and positioning strip — self-identification cue. */
  audiences: [
    "PTA & school foundations",
    "Youth sports leagues",
    "Local nonprofits",
    "Community theaters",
    "Neighborhood associations",
    "Environmental groups",
    "Food banks & pantries",
    "Historical societies",
    "Small local businesses",
    "Volunteer coalitions",
  ] as const,
} as const;

export const hero = {
  eyebrow: icp.label,
  /** Outcome-first, not mechanism-first — the thing the buyer actually wants. */
  headline: "More donors say yes. More volunteers show up.",
  subhead:
    "Meridian runs your website, social content, and content calendar — so your board stops juggling three different vendors and starts seeing it work.",
  /** Above-the-fold credibility cue. A guarantee, not a stat — see DESIGN_NOTES.md for why. */
  credibilityCue: {
    title: "Free 15-minute presence check",
    body: "No obligation, no pitch deck. We'll show you exactly what a funder or a new volunteer sees when they look you up today.",
  },
  authorityStance:
    "We never post to your account without your review — organic strategy only.",
} as const;

/**
 * Trust-stat banner — a single external, authoritative claim shown right
 * after the hero (pattern borrowed from a reference B2B site). Unlike the
 * illustrative stats in `proof.stats`, this would be a *real* third-party
 * citation, not our own measured number — left as an explicit placeholder
 * until a real source is picked, per the site's no-fake-proof rule.
 */
export const trustStat = {
  quote:
    "[PLACEHOLDER: a real, cited external stat about website/social presence and donor, sponsor, or customer trust — e.g. published research from Nonprofit Tech for Good, Qgiv, or a comparable source]",
  source: "[PLACEHOLDER: source name + year]",
} as const;

/**
 * Presence Scorecard — the signature element. What a funder or board member
 * actually checks before trusting an organization, presented as a checklist.
 * See PresenceScorecard component for the one signature scroll animation.
 */
export const scorecard = {
  eyebrow: "What people actually check",
  title: "Before anyone reads your proposal, they check this.",
  body: "Grant officers, sponsors, and new volunteers form an opinion in seconds — usually by looking you up first. This is what they're actually looking at.",
  items: [
    "A real, working website — not a dead link from three years ago",
    "Posting that didn't stop after launch week",
    "Numbers that are real, not bought",
    "A logo, colors, and voice that all match",
    "Someone clearly accountable for keeping it that way",
  ],
  methodNote:
    "This is the exact checklist we run during the presence audit on every intro call — not a survey result.",
} as const;

/**
 * Proof section. Testimonials and the logo row are illustrative until real
 * engagements complete — each is labeled plainly so it's never mistaken for
 * verified proof. Stats are sourced to the specific illustrative case study
 * they're drawn from (see caseStudies below), not presented as a fleet-wide
 * average.
 */
export const proof = {
  eyebrow: "Proof, not vibes",
  title: "What changes when the presence is real.",
  logoRowLabel: "[PLACEHOLDER: real client logos will replace this row]",
  testimonials: [
    {
      quote:
        "Volunteer sign-ups were up 40% in the six weeks before our spring gala — and for the first time, people told us our Instagram looked like a real organization.",
      name: "Maria Chen",
      role: "Program Director",
      org: "Riverside Arts Collective",
      label: "ILLUSTRATIVE EXAMPLE — not yet a real client",
    },
    {
      quote:
        "Two new sponsors told us directly that the league's page is why they said yes. That never happened before.",
      name: "Dave Okonkwo",
      role: "League Commissioner",
      org: "Hillcrest Youth Soccer",
      label: "ILLUSTRATIVE EXAMPLE — not yet a real client",
    },
  ],
  stats: [
    {
      value: 3.4,
      decimals: 1,
      suffix: "×",
      label: "reach in 90 days",
      source: "Riverside Arts Collective, illustrative example",
    },
    {
      value: 240,
      suffix: "%",
      label: "more saves on registration posts",
      source: "Hillcrest Youth Soccer, illustrative example",
    },
    {
      value: 180,
      suffix: "%",
      label: "more profile visits",
      source: "North End Food Pantry, illustrative example",
    },
  ],
} as const;

export const services = {
  eyebrow: "What you get",
  title: "Your whole online presence, run for you.",
  subhead:
    "Website, hosting, social, and community outreach — one team, instead of five vendors who don't talk to each other.",
  items: [
    {
      title: "A website that doesn't embarrass you",
      body: "Built, hosted, and kept online — domain and database included. No separate web host or developer for you to manage.",
      outcome: "Funders find a real site, not a dead link.",
      emoji: "🌐",
    },
    {
      title: "Graphics that look like you paid for them",
      body: "A visual system and templates built for your organization, so every post looks deliberate instead of thrown together at 11pm.",
      outcome: "Your page stops looking like a volunteer's side project.",
      emoji: "🎨",
    },
    {
      title: "A calendar that actually gets followed",
      body: "A plan mapped to your real programming and season. AI helps us draft faster; a person on our team reviews everything before it goes out.",
      outcome: "Posting doesn't stop after launch week.",
      emoji: "🗓️",
    },
    {
      title: "Outreach that turns followers into people",
      body: "Planning and promoting the events, sponsor conversations, and partnerships that build real relationships.",
      outcome: "New sponsors and volunteers, not just new followers.",
      emoji: "🤝",
    },
    {
      title: "Reporting you can actually check",
      body: "We read your account's real metrics through Meta's official API — reach, engagement, growth — and report them straight.",
      outcome: "Numbers you can put in a board deck without flinching.",
      emoji: "📊",
    },
  ],
  approach: [
    {
      n: "01",
      title: "Intro call",
      body: "A short, no-pressure conversation about your organization and what a credible presence would unlock.",
      emoji: "☕",
    },
    {
      n: "02",
      title: "Presence audit",
      body: "We run the same checklist as the Presence Scorecard against your organization, honestly.",
      emoji: "🔍",
    },
    {
      n: "03",
      title: "Build & calendar",
      body: "We design the system and lay out a content calendar tied to your programming — you approve the direction.",
      emoji: "🛠️",
    },
    {
      n: "04",
      title: "Run & report",
      body: "Consistent, reviewed content, and a plain-English insights review so you can see it working.",
      emoji: "🚀",
    },
  ],
} as const;

/**
 * Operational pain points — deliberately distinct from the Presence
 * Scorecard (which covers how the org *looks* to outsiders): this covers
 * the day-to-day coordination problems that cause that look in the first
 * place. Descriptive, not a proof/stat claim, so it needs no source.
 */
export const challenges = {
  eyebrow: "Sound familiar?",
  title: "The mission isn't the problem. This is.",
  items: [
    "The website hasn't been touched since the day it launched",
    "Instagram goes quiet for weeks, then everyone apologizes for it",
    "Nobody's sure whose job it is to post this week",
    "Every graphic looks different because it's whoever had 20 free minutes",
    "“Reporting” means someone screenshotting a follower count",
    "One volunteer holds every password, and there's no backup",
    "Three different vendors who've never spoken to each other",
    "No real idea whether any of it is working",
  ],
} as const;

/**
 * "One system" differentiation — the connective explanation for why the
 * five services above aren't five separate line items. Real description of
 * how Meridian's own engagement works, not a placeholder.
 */
export const system = {
  eyebrow: "How it fits together",
  title: "Not five vendors. One system, one monthly bill.",
  subhead:
    "Design, content, and reporting are usually three separate relationships that don't talk to each other. Here, they're one.",
  steps: [
    {
      n: "01",
      title: "Design & brand",
      body: "A website and visual system built once, so every page and post match.",
    },
    {
      n: "02",
      title: "Content & calendar",
      body: "A real posting schedule tied to your actual programming, reviewed by a person before it goes out.",
    },
    {
      n: "03",
      title: "Insights & reporting",
      body: "Plain-English numbers pulled straight from Meta's own API, sent to you every month.",
    },
  ],
} as const;

/**
 * Press/awards recognition row — distinct from `proof.logoRowLabel` (real
 * client logos). Explicitly placeholder per the site's no-fake-proof rule;
 * bracketed captions only, never styled to resemble a real award seal.
 */
export const recognition = {
  eyebrow: "Recognition",
  label:
    "[PLACEHOLDER: press features, local awards, or directory listings will replace these as they're earned]",
  items: [
    "[PLACEHOLDER: press feature]",
    "[PLACEHOLDER: chamber recognition]",
    "[PLACEHOLDER: directory listing]",
    "[PLACEHOLDER: industry award]",
  ],
} as const;

/**
 * Pricing. Three visible tiers (Hick's law) — the underlying plan system
 * also has a Free tier (used by the dashboard/demo), surfaced here only as
 * a low-commitment footnote rather than a fourth box, so the paid grid never
 * exceeds three choices. Round numbers on the two higher tiers (Meridian
 * sells credibility); the entry tier keeps its existing charm price.
 */
export const pricing = {
  eyebrow: "Pricing",
  title: "Simple plans. No shocking invoices. Ever.",
  subhead:
    "Pick a tier, cancel anytime. Most organizations land on Growth — but Starter is a genuinely good place to begin.",
  anchor:
    "A part-time marketing hire runs about $2,000/mo. A small agency retainer starts around $2,500/mo. Meridian starts at $19.99/mo.",
  freeFootnote:
    "Just want to try it first? Ask about the free plan on your intro call — no card required.",
  annualDiscountLabel: "2 months free",
  guarantee:
    "Cancel anytime. If the first 30 days aren't a fit, full refund — no questions asked.",
  capacityNote:
    "We onboard 4 new organizations a month, so the work stays personal.",
  tiers: [
    {
      name: "Basic" as PlanName,
      displayName: "Starter",
      price: 19.99,
      tagline: "So every org can afford to look good.",
      features: [
        "Branded template kit",
        "Monthly content calendar",
        "2 posts designed per month",
        "Basic insights check-in",
      ],
      highlighted: false,
      cta: cta.primary,
    },
    {
      name: "Average" as PlanName,
      displayName: "Growth",
      price: 59,
      tagline: "The one most people pick.",
      features: [
        "Everything in Starter",
        "Website, designed & hosted",
        "Full brand system & templates",
        "8 posts designed per month",
        "Monthly insights report",
      ],
      highlighted: true,
      badge: "Most popular",
      cta: cta.primary,
    },
    {
      name: "Pro" as PlanName,
      displayName: "Managed",
      price: 179,
      tagline: "The full organization stack.",
      features: [
        "Everything in Growth",
        "Unlimited post designs",
        "Community events & outreach support",
        "Priority turnaround",
        "Quarterly deep-dive report",
      ],
      highlighted: false,
      cta: cta.primary,
    },
  ],
} as const;

/**
 * FAQ, ordered by which objection most likely blocks the sale for a
 * cautious, budget-conscious buyer — price first, mechanism last. Ends on
 * the single CTA.
 */
export const faq = [
  {
    q: "Is this actually worth it for an organization our size?",
    a: "If a part-time hire runs $2,000/mo and an agency starts around $2,500/mo, Starter at $19.99/mo isn't really a close call. Most of the orgs we talk to are exactly your size — that's who this is built for.",
  },
  {
    q: "What do we actually get for the price?",
    a: "Depends on the tier, but at minimum: a branded template kit, a real content calendar, and designed posts every month. Growth adds a full website. Nothing is vague — the pricing page lists exactly what's included at each level.",
  },
  {
    q: "Will you post to our account for us?",
    a: "We build the content and a clear calendar, but nothing publishes without a human on your side reviewing it first. You can have us schedule with your explicit approval, or hand you ready-to-post assets — you always stay in control of your own account.",
  },
  {
    q: "We're a volunteer board with no time. Is this more work for us?",
    a: "It should be less. You review and approve on your own schedule — there's no dashboard to learn, no new software to manage day to day. The point is that someone else is finally accountable for it.",
  },
  {
    q: "How does the growth actually happen?",
    a: "Consistent, well-designed content posted on a real schedule, plus honest reporting so you can see what's working. We're glad to walk through the specifics on your intro call.",
  },
] as const;

export const contact = {
  eyebrow: "Book an intro call",
  headline: "Let's talk about your presence.",
  subhead:
    "Tell us a little about your organization and we'll reach out to schedule a time.",
  expect: [
    {
      title: "A short conversation",
      body: "Fifteen to twenty minutes. We learn about your organization and what a credible presence would unlock.",
    },
    {
      title: "An honest read",
      body: "We'll tell you plainly whether we're a fit — and what we'd focus on first if we are.",
    },
    {
      title: "No pressure",
      body: "No hard sell, no obligation. Just a clear picture of what working together would look like.",
    },
  ],
  reassurance: "15 minutes, no obligation, no sales pressure.",
  successTitle: cta.primarySuccess,
  successBody:
    "We'll be in touch within one business day to find a time. Keep an eye on your inbox.",
} as const;

export type PricingTierConfig = (typeof pricing.tiers)[number];
