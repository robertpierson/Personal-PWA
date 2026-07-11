# Marquee — Marketing Site Rebuild: Design Notes

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

## 2. Design-token rationale — dark-premium retheme (supersedes the original blue+gold civic-ledger pass below)

The site shipped for a while as a light "civic-ledger" blue+gold theme (see the original rationale bullets that follow, kept for history). It was then fully retheme'd to a dark-premium identity — warm near-black + one gold accent, no blue, no cream anywhere, dashboard and marketing site sharing one surface language instead of a light/dark split. Full rationale lives as the comment block at the top of `src/app/globals.css`; summarized here:

- **One accent, not two hue families.** The `forest` token family (previously blue, the primary/CTA color) and the `gold` token family (previously a secondary accent for eyebrows/figures) both now repoint to the same warm gold (`#E6B24A`) — see `brand.config.ts`. Token names are kept from the prior design for the same low-diff reason the prior author kept `forest` after its bottle-green→blue pivot: dozens of `bg-forest`/`text-forest`/`bg-gold`/`text-gold-*` classes already exist across the codebase, and renaming buys no visual benefit.
- **Backgrounds inverted, not just darkened.** `--color-paper` (base bg) is now `#0B0B0C`, `--color-panel` (cards) is `#141416`, `--color-paper-2` (nested surfaces/hover/footer) is `#1B1B1E`. Text tokens inverted the same way: `--color-ink` is now a warm off-white (`#F4F3EE`). Because the whole app already sourced every surface/text color from these tokens rather than hard-coded hex, the retheme is almost entirely value changes in `globals.css`'s `@theme` block, not a component rewrite.
- **The one place blind inversion broke things: text sitting on a solid accent fill.** Before, `text-paper` meant "light text for the one dark accent band"; after inversion, `paper` *is* the near-black value, so `text-paper` on a solid gold button/badge is now exactly the near-black-on-gold contrast the new palette needs — no change required there. But `text-ink` (now off-white) previously meant "dark text on a light card" and was never used on solid accent fills — a few spots did use it on `bg-gold` (the "Most popular" badge, the unread-notification badge, the Scorecard checkmark, the admin demo banner) and needed an explicit fix to `text-paper` post-retheme, since off-white-on-gold measures under 2:1 contrast. Two full-bleed gradient sections (the homepage "one system" band and both CTA bands) previously ran a dark-blue-to-navy gradient with light text throughout; once `forest`/`forest-ink` became gold-to-near-black, no single text color worked across that gradient, so those sections were redesigned as elevated dark panels with a gold border/glow instead of a gold fill.
- **Status pills collapsed to a real 3-bucket system**: gold/attention (in progress, in review, an open invoice), muted off-white (delivered, scheduled, approved, published, paid), faint (not started, idea, drafting, draft, void) — replacing what had become a de facto blue-vs-gold-vs-neutral 3-color system that no longer had two distinct hues to draw on post-retheme.
- **Fonts swapped to Clash Display (display) and General Sans (body)**, both from Fontshare, self-hosted via `next/font/local` as single variable-weight `.woff2` files in `src/app/fonts/` (license: `src/app/fonts/LICENSE-fontshare.txt`). Eyebrows moved from the body face to a mono (JetBrains Mono via `next/font/google`), per the "numbers/labels are measured, not decorative" idea the prior `.figure`/mono treatment already established for prices and stats.
- **The dashboard's light/dark toggle was removed.** There's one theme now, sitewide — `components/dashboard/theme-toggle.tsx` and `theme-init.tsx` are deleted, the `[data-theme="dark"]` override block is gone from `globals.css`, and `:root { color-scheme: dark }` is the default everywhere (was previously the marketing site's light-only default).
- **A faint film-grain texture** (`body`'s own `background-image`, a 1px radial-gradient dot pattern at ~3.5% opacity) is the one new signature texture, sitewide.

<details>
<summary>Original blue+gold civic-ledger rationale (superseded above, kept for history)</summary>

- **Palette pivot, not a tweak.** The previous system — warm cream + high-contrast display serif + single navy accent — is named directly in §3 as one of the three palettes AI tools converge on. Rather than adjust it, the palette was re-derived from the actual subject: this studio sells credibility to people who run town halls, food pantries, youth leagues, and small local boards. So it borrowed civic/municipal visual language (deed stamps, ledger ink, brass seals) instead of editorial-magazine design.
- **Primary color was a vivid royal/cobalt blue** (`--color-forest: #2451d6`, deep variant `--color-forest-deep: #16309e`). Blue + gold was the explicit brand direction after the initial "civic ledger" bottle-green palette shipped.
- **Type pairing**: Zilla Slab (built for Mozilla's civic-tech work) for display instead of an editorial high-contrast serif; Public Sans — the U.S. Web Design System's typeface — for body.
- **A dark theme existed for the dashboard app-shell only** (not the marketing site, which stayed light-only): a `[data-theme="dark"]` block in `globals.css` overrode the same custom properties the whole dashboard already read, toggled from Settings > Appearance and persisted to `localStorage`. Removed in the dark-premium retheme above — there's one theme now.

</details>

## 3. Motion system — the three sanctioned motions

Per §4/§10, exactly three, named and scoped, replacing the prior blanket `<Reveal>` fade-up on every section:

1. **Signature hover** (`.tilt-card`, `.pop-btn`) — a lift + shadow on cards, a scale on buttons. Used consistently on every interactive card/button, nowhere else.
2. **Signature scroll moment** — the Presence Scorecard's checklist ticking in (`.check-in`) and the proof stats counting up (`.stat-pop`), both once, both only in the Proof section.
3. **Isolation pop** (`.badge-pop`) — the "Most popular" pricing badge scaling in. Used on exactly one element per page (verified via grep during the critique pass).
4. **Scroll-entrance** (`.reveal` / `<Reveal>`) — added after initial ship, by explicit request, to `/services` and `/pricing` only: a fade + lift as each section/card scrolls into view, plus hover-lift on the new work-sample cards and pricing tiers. Deliberately *not* applied sitewide — the "blanket fade-up on every section" tell from the original audit (§1, homepage) still applies everywhere else. The homepage's compact `<PricingTiles compact />` embed shares the tier-card component with `/pricing` but is explicitly excluded from the Reveal wrapper so it stays static.

The audience marquee's continuous scroll is decorative-only and exempt (it never gates or delays content). All motion, including `.reveal`, is wrapped in `prefers-reduced-motion` guards (a blanket rule in `globals.css` plus explicit per-feature overrides, consistent with the pre-existing pattern in this codebase).

## 4. Psychology tactics — where each was applied

| Tactic | Where | Detail |
|---|---|---|
| Cognitive fluency | Sitewide | High-contrast type, fast static rendering (no page-load motion), the scroll-wheel's ~350vh delay removed entirely. |
| Self-identification | Hero eyebrow + audience marquee | `icp.label` names the buyer directly; marquee lists org types so a skimmer sees themselves in the first 2 seconds. |
| Authority / risk-reduction | Hero subhead, footer, FAQ | "We never post to your account without your review" repeated at the point of highest anxiety (hero, contact page, FAQ #3) rather than buried once. |
| Social proof | Proof section | Testimonials + sourced stats, each traceable to a specific (labeled-illustrative) case study rather than a fleet-wide unsourced average. |
| Reciprocity | Hero credibility cue | "Free 15-minute presence check" — a genuinely honest low-commitment offer, chosen deliberately over a fabricated stat since the studio has zero real clients yet (see final report, flagged decision). |
| Anchoring | Pricing (`pricing.anchor`) | Cost-of-alternative line ("a part-time hire runs ~$2,000/mo… Marquee starts at $19/mo") shown directly above the tier grid on both the homepage and `/pricing`. |
| Center-stage / decoy | Pricing tiers | Three tiers only; the middle tier (Growth) is visually dominant (`scale-105`, gold border + glow, badge) so it reads as the obvious sensible choice. |
| Von Restorff isolation | Pricing tiers | The highlighted tier gets a categorically different treatment (gold border/glow vs. plain hairline) plus the one `badge-pop` animation on the page. |
| Round pricing throughout | Pricing tiers | All three tiers are round numbers ($19, $59, $179) — no ragged charm decimals, so "No shocking invoices. Ever." holds even in the fine print. The annual toggle rounds to the nearest whole dollar too, for the same reason. |
| Framing | Pricing tiers | Both a monthly price and a "≈ $X/day" line under every tier, shrinking the perceived cost. |
| Loss aversion | Pricing annual toggle | Switching to annual shows "Don't lose $Z/yr — save it instead" rather than "save $Z" alone. |
| Ethical scarcity | Pricing (`pricing.capacityNote`) | "We onboard 4 new organizations a month" — a real operating constraint, not a countdown timer. Flagged in the final report as a number the human should confirm. |
| Risk reversal | Pricing (`pricing.guarantee`) | "Cancel anytime. If the first 30 days aren't a fit, full refund" placed directly under the tier grid. |
| Hick's law | Nav (4 items), pricing (3 tiers), CTA (1 primary + 1 subordinate per screen), form (one step visible at a time) | Applied as a hard ceiling everywhere choices are presented. |
| Goal-gradient / foot-in-the-door | Contact form | Three-step progressive form (name+email → organization → optional timing/goals) with a visible "Step X of 3 · Y% done" bar. |
| Reduced risk at the point of action | Contact form, hero | "15 minutes, no obligation, no sales pressure" directly under the submit button; guarantee copy repeated in the final CTA band. |

No fake countdowns, fabricated reviews, or hidden-cost patterns were used anywhere — per the brief's own instruction, and because the studio's positioning is explicitly built on honesty (the "we never automate" stance would be undermined by manufacturing urgency elsewhere).
