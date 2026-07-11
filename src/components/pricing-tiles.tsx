"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { pricing } from "@/content/site.config";

function money(n: number) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

/**
 * Pricing tiers with the psychology tactics named in DESIGN_NOTES.md:
 * anchoring (cost-of-alternative line), center-stage/decoy (middle tier
 * dominant), Von Restorff isolation (highlighted tier gets a distinct
 * surface + badge), round pricing throughout (no ragged charm decimals —
 * see site.config.ts), day-rate framing, and a loss-aversion annual toggle.
 * The annual price is rounded to the nearest whole dollar too — a raw
 * price/12 division produces exactly the kind of ugly decimal ($16.66,
 * $49.17) the round-pricing rule exists to avoid.
 *
 * `compact` renders the condensed homepage version (no toggle, no
 * guarantee/capacity copy, fewer features) — same tiers, same prices.
 */
export function PricingTiles({ compact = false }: { compact?: boolean }) {
  const [annual, setAnnual] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{pricing.eyebrow}</p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {compact ? "Pricing, right here." : pricing.title}
          </h2>
          <p className="mt-3 max-w-xl text-ink-soft">{pricing.subhead}</p>
        </div>

        {!compact && (
          <div className="flex items-center gap-3 rounded-full border border-line-strong bg-panel p-1">
            <button
              type="button"
              onClick={() => setAnnual(false)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-panel ${
                !annual ? "bg-forest text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnual(true)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-panel ${
                annual ? "bg-forest text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              Annual
              <span className="ml-1.5 text-xs opacity-80">
                ({pricing.annualDiscountLabel})
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Anchoring: reframe the price against the real alternative */}
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-soft">
        {pricing.anchor}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {pricing.tiers.map((tier, i) => {
          const monthlyPrice = tier.price;
          const annualTotal = monthlyPrice * 10; // 2 months free
          const displayPrice = annual ? Math.round(annualTotal / 12) : monthlyPrice;
          const perDay = displayPrice / 30;
          const savings = monthlyPrice * 12 - annualTotal;

          // Reveal is scoped to the standalone /pricing and /services pages
          // only (see globals.css) — the homepage's `compact` embed of this
          // component stays static, no scroll-entrance animation.
          const Wrapper = compact ? "div" : Reveal;
          const wrapperProps = compact
            ? { className: "relative" }
            : { className: "relative", delay: i * 90 };

          return (
            <Wrapper key={tier.name} {...wrapperProps}>
              {tier.highlighted && (
                <span className="badge-pop absolute -top-4 right-6 z-10 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-paper shadow-card">
                  {tier.badge}
                </span>
              )}
              <div
                className={`relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-card)+4px)] border p-7 transition-transform duration-200 ${
                  tier.highlighted
                    ? "scale-[1.03] border-gold/40 bg-panel shadow-glow-gold"
                    : "border-line bg-panel hover:-translate-y-1 hover:shadow-lift"
                }`}
              >
                {tier.highlighted && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
                  />
                )}
                <h3 className="relative font-serif text-xl tracking-tight text-ink">
                  {tier.displayName}
                </h3>
                <p className="relative mt-1 text-sm text-ink-faint">
                  {tier.tagline}
                </p>

                <div className="relative mt-5 flex items-baseline gap-1.5">
                  <span className="figure text-4xl font-semibold text-ink">
                    {money(displayPrice)}
                  </span>
                  <span className="text-ink-faint">/mo</span>
                </div>
                <p className="relative mt-1 text-xs text-ink-faint">
                  ≈ {money(Math.round(perDay * 100) / 100)}/day
                  {annual && ` · billed $${Math.round(annualTotal)}/yr`}
                </p>
                {annual && (
                  <p className="relative mt-1 text-xs font-medium text-gold">
                    Don&apos;t lose ${Math.round(savings)}/yr — save it instead
                  </p>
                )}

                {!compact && (
                  <ul className="relative mt-6 flex-1 space-y-2.5 border-t border-line pt-5 text-sm text-ink-soft">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            tier.highlighted ? "bg-gold" : "bg-ink-faint"
                          }`}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}

                <ButtonLink
                  href="/contact"
                  size="lg"
                  className="pop-btn relative mt-6 w-full"
                  variant={tier.highlighted ? "primary" : "secondary"}
                >
                  {tier.cta}
                </ButtonLink>
              </div>
            </Wrapper>
          );
        })}
      </div>

      {!compact && (
        <div className="mt-8 flex flex-col gap-2 text-center text-sm text-ink-soft">
          <p className="font-medium text-ink">{pricing.guarantee}</p>
          <p className="text-ink-faint">{pricing.capacityNote}</p>
          <p className="text-ink-faint">{pricing.freeFootnote}</p>
        </div>
      )}
    </div>
  );
}
