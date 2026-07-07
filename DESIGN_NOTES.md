# Meridian — Marketing Site Rebuild: Design Notes

Living document for the conversion-focused rebuild. Updated per §2 of the brief as work progresses.

## 1. Audit pass — defects found (before rebuild)

### Homepage
- Hero sold the mechanism ("look legit online") not an outcome; no number, no above-fold credibility cue.
- No pricing visible on the homepage at all (violates §1.3) — only a teaser card linking to `/pricing`.
- "By the numbers" stats (3.4×, 48hr, 100%, 5★) had zero source/attribution — presented as fact (violates §1.4).
- No testimonials, no named clients, no logos anywhere on the site — proof section didn't exist.
- Case-study placeholders were labeled only by a small caption below the grid, easy to miss.
- Decorative giant "01/02" watermark numbers on the Services/Pricing teaser cards, where the content isn't a sequence (named directly in §3).
- "Why it matters" used a scroll-jacking circular wheel (3 items spread across ~210vh of scroll) — a novelty interaction that delays a skimming, cautious buyer from reading three sentences. Wrong tool for this audience.
- `HeroAurora` glow (blurred gradient blob) is in the same family as the "gradient hero / glowing blobs" tell, even muted to one hue.
- Nearly every section wrapped in the same `<Reveal>` fade-up — "one global fade-up applied to every section" is named verbatim in §3.
- Cream paper + high-contrast serif (Fraunces) + single navy accent is *exactly* the flagged default combo.

### Services page
- Full 5-item scroll-jacking "wheel" (a literal rotating dial) to present a plain services list — same issue as above, worse: ~350vh of scroll for content that should be scannable in 10 seconds.
- Feature descriptions were mechanism-first ("a visual system and post templates"), not outcome-first.

### Pricing page (and absent from homepage)
- Four tiers (Free/Basic/Average/Pro) — exceeds the 3-tier Hick's-law ceiling in §5/§6.
- No anchor against cost-of-alternative (hiring / agency).
- No annual toggle, no loss-aversion framing, no "save $Z."
- No concrete guarantee / risk-reversal statement.
- No capacity/scarcity statement.
- A "= N credits/mo" line cluttered every price block with a mechanic irrelevant to purchase decisions.
- Highlighted ("Most popular") tier existed, but with 4 tiers it wasn't the visual center.

### FAQ
- No price-justification question at all — the single biggest objection for a budget-conscious buyer was unaddressed.
- Order wasn't objection-priority: mechanism-of-growth led, price/overkill buried.
- No closing CTA at the end of the FAQ list.

### Contact
- All 6 fields shown at once, no progressive disclosure, no step indicator.
- CTA button read "Request intro call" — a different verb from "Book an intro call" used everywhere else (the exact CTA-drift problem named in §3/§5).

### Nav / global
- Nav CTA read "Book intro call" (missing "an") — same drift issue, smaller instance.
- No sticky CTA on mobile scroll.
- No `robots.ts`, `sitemap.ts`, custom `not-found.tsx`, or `opengraph-image` — metadata declared `openGraph`/`twitter` fields but no actual image, so link shares would render blank.

### Copy tells present
- "AI-assisted tools," filler like "seamless"/"effortless" not present verbatim, but several outcome-less lines ("a following that keeps growing," "reporting you can actually trust") state a feeling, not a measured result.

Everything above is addressed in the sections that follow; where something is only partially fixed, that's flagged explicitly in the final report rather than glossed over.

## 2. Design-token rationale — why this is not the generic default

The full rationale lives as a comment block at the top of `src/app/globals.css` (kept next to the tokens so it can't drift out of sync); summarized here:

- **Palette pivot, not a tweak.** The previous system — warm cream + high-contrast display serif + single navy accent — is named directly in §3 as one of the three palettes AI tools converge on. Rather than adjust it, the palette is re-derived from the actual subject: Meridian sells credibility to people who run town halls, food pantries, youth leagues, and small local boards. So it borrows civic/municipal visual language (deed stamps, ledger ink, brass seals) instead of editorial-magazine design.
- **Primary color is a real bottle green** (`--color-forest: #1f3d31`) — the color of credit unions, park departments, and land trusts. Confirmed NOT navy/indigo/purple and NOT clay/terracotta (`#D97757`-family hues sit at ~16° hue; this accent gold sits at ~40°, and the primary green isn't in that family at all).
- **Background is cooler/grayer stone** (`#f2f0e8`), not golden cream — a small shift that reads very differently once type/spacing are also different.
- **Type pairing swapped entirely**: Zilla Slab (built for Mozilla's civic-tech work) for display instead of an editorial high-contrast serif; Public Sans — literally the U.S. Web Design System's typeface for government digital services — for body, instead of a generic modern grotesk. Both are on-theme and neither is a common AI-site default.
- **A monospace (IBM Plex Mono) is reserved for numbers that are claims** — prices and stats get the `.figure` class, a small but deliberate signal that a given number is measured, not decorative.
- **Contrast verified by hand**, not assumed: ink/paper ≈15.6:1, ink-faint/paper ≈5.6:1, ink-faint/paper-2 ≈5.1:1, forest/paper ≈10.4:1, gold-text on gold-soft-tinted badges ≈6.3:1. Gold itself (`#b8862e`) measures only ≈2.8:1 on paper — confirmed decorative-only (badges with dark text on top, icons, borders), never used as small body/label text on a light background. One real bug was caught and fixed during build: a testimonial label combined `.eyebrow-gold` (light gold, meant for dark backgrounds) with a light card background — see §12 in the final report.

## 3. Motion system — the three sanctioned motions

Per §4/§10, exactly three, named and scoped, replacing the prior blanket `<Reveal>` fade-up on every section:

1. **Signature hover** (`.tilt-card`, `.pop-btn`) — a lift + shadow on cards, a scale on buttons. Used consistently on every interactive card/button, nowhere else.
2. **Signature scroll moment** — the Presence Scorecard's checklist ticking in (`.check-in`) and the proof stats counting up (`.stat-pop`), both once, both only in the Proof section. Nowhere else on the site animates on scroll.
3. **Isolation pop** (`.badge-pop`) — the "Most popular" pricing badge scaling in. Used on exactly one element per page (verified via grep during the critique pass).

The audience marquee's continuous scroll is decorative-only and exempt (it never gates or delays content). All motion is wrapped in `prefers-reduced-motion` guards (a blanket rule in `globals.css` plus explicit per-feature overrides, consistent with the pre-existing pattern in this codebase).

## 4. Psychology tactics — where each was applied

| Tactic | Where | Detail |
|---|---|---|
| Cognitive fluency | Sitewide | High-contrast type, fast static rendering (no page-load motion), the scroll-wheel's ~350vh delay removed entirely. |
| Self-identification | Hero eyebrow + audience marquee | `icp.label` names the buyer directly; marquee lists org types so a skimmer sees themselves in the first 2 seconds. |
| Authority / risk-reduction | Hero subhead, footer, FAQ | "We never post to your account without your review" repeated at the point of highest anxiety (hero, contact page, FAQ #3) rather than buried once. |
| Social proof | Proof section | Testimonials + sourced stats, each traceable to a specific (labeled-illustrative) case study rather than a fleet-wide unsourced average. |
| Reciprocity | Hero credibility cue | "Free 15-minute presence check" — a genuinely honest low-commitment offer, chosen deliberately over a fabricated stat since Meridian has zero real clients yet (see final report, flagged decision). |
| Anchoring | Pricing (`pricing.anchor`) | Cost-of-alternative line ("a part-time hire runs ~$2,000/mo… Meridian starts at $19.99/mo") shown directly above the tier grid on both the homepage and `/pricing`. |
| Center-stage / decoy | Pricing tiers | Three tiers only; the middle tier (Growth) is visually dominant (`scale-105`, dark surface, badge) so it reads as the obvious sensible choice. |
| Von Restorff isolation | Pricing tiers | The highlighted tier gets a categorically different surface (dark bg-forest vs. panel) plus the one `badge-pop` animation on the page. |
| Charm vs. round pricing | Pricing tiers | Entry tier keeps its existing charm price ($19.99); the two higher tiers are round numbers ($59, $179) — credibility-forward, no blanket `.99`. |
| Framing | Pricing tiers | Both a monthly price and a "≈ $X/day" line under every tier, shrinking the perceived cost. |
| Loss aversion | Pricing annual toggle | Switching to annual shows "Don't lose $Z/yr — save it instead" rather than "save $Z" alone. |
| Ethical scarcity | Pricing (`pricing.capacityNote`) | "We onboard 4 new organizations a month" — a real operating constraint, not a countdown timer. Flagged in the final report as a number the human should confirm. |
| Risk reversal | Pricing (`pricing.guarantee`) | "Cancel anytime. If the first 30 days aren't a fit, full refund" placed directly under the tier grid. |
| Hick's law | Nav (4 items), pricing (3 tiers), CTA (1 primary + 1 subordinate per screen), form (one step visible at a time) | Applied as a hard ceiling everywhere choices are presented. |
| Goal-gradient / foot-in-the-door | Contact form | Three-step progressive form (name+email → organization → optional timing/goals) with a visible "Step X of 3 · Y% done" bar. |
| Reduced risk at the point of action | Contact form, hero | "15 minutes, no obligation, no sales pressure" directly under the submit button; guarantee copy repeated in the final CTA band. |

No fake countdowns, fabricated reviews, or hidden-cost patterns were used anywhere — per the brief's own instruction, and because Meridian's positioning is explicitly built on honesty (the "we never automate" stance would be undermined by manufacturing urgency elsewhere).
