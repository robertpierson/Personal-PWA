"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { pricing } from "@/content/site.config";

function money(n: number) {
  return n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`;
}

/**
 * Pricing tiers with the psychology tactics named in DESIGN_NOTES.md:
 * anchoring (cost-of-alternative line), center-stage/decoy (middle tier
 * dominant), Von Restorff isolation (highlighted tier gets a distinct
 * surface + badge), charm vs. round pricing (entry tier keeps its existing
 * charm price; the two higher tiers are round numbers — Meridian sells
 * credibility), day-rate framing, and a loss-aversion annual toggle.
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
        {pricing.tiers.map((tier) => {
          const monthlyPrice = tier.price;
          const annualTotal = monthlyPrice * 10; // 2 months free
          const displayPrice = annual ? annualTotal / 12 : monthlyPrice;
          const perDay = displayPrice / 30;
          const savings = monthlyPrice * 12 - annualTotal;

          return (
            <div key={tier.name} className="relative">
              {tier.highlighted && (
                <span className="badge-pop absolute -top-4 right-6 z-10 rounded-full bg-gold px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-ink shadow-card">
                  {tier.badge}
                </span>
              )}
              <div
                className={`flex h-full flex-col rounded-[calc(var(--radius-card)+4px)] border p-7 transition-transform duration-200 ${
                  tier.highlighted
                    ? "scale-[1.03] border-forest bg-forest text-paper shadow-lift"
                    : "border-line bg-panel"
                }`}
              >
                <h3 className="font-serif text-xl tracking-tight">
                  {tier.displayName}
                </h3>
                <p
                  className={`mt-1 text-sm ${tier.highlighted ? "text-paper/80" : "text-ink-faint"}`}
                >
                  {tier.tagline}
                </p>

                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="figure text-4xl font-semibold">
                    {money(Math.round(displayPrice * 100) / 100)}
                  </span>
                  <span
                    className={tier.highlighted ? "text-paper/70" : "text-ink-faint"}
                  >
                    /mo
                  </span>
                </div>
                <p
                  className={`mt-1 text-xs ${tier.highlighted ? "text-paper/60" : "text-ink-faint"}`}
                >
                  ≈ {money(Math.round(perDay * 100) / 100)}/day
                  {annual && ` · billed $${Math.round(annualTotal)}/yr`}
                </p>
                {annual && (
                  <p
                    className={`mt-1 text-xs font-medium ${tier.highlighted ? "text-gold-soft" : "text-forest"}`}
                  >
                    Don&apos;t lose ${Math.round(savings)}/yr — save it instead
                  </p>
                )}

                {!compact && (
                  <ul
                    className={`mt-6 flex-1 space-y-2.5 border-t pt-5 text-sm ${
                      tier.highlighted ? "border-paper/20" : "border-line"
                    }`}
                  >
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            tier.highlighted ? "bg-gold-soft" : "bg-forest"
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
                  className={`pop-btn mt-6 w-full ${
                    tier.highlighted
                      ? "!bg-none !bg-paper !text-forest hover:!bg-white"
                      : ""
                  }`}
                  variant={tier.highlighted ? "primary" : "secondary"}
                >
                  {tier.cta}
                </ButtonLink>
              </div>
            </div>
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
