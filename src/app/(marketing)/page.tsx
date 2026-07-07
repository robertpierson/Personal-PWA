import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { CaseStudyCard } from "@/components/case-study-card";
import { Faq } from "@/components/faq";
import { AnimatedStat } from "@/components/animated-stat";
import { PresenceScorecard } from "@/components/presence-scorecard";
import { PricingTiles } from "@/components/pricing-tiles";
import { caseStudies } from "@/content/case-studies";
import {
  cta,
  hero,
  icp,
  proof,
  services as servicesConfig,
} from "@/content/site.config";

export default function HomePage() {
  return (
    <>
      {/* ————— Hero — no motion, everything visible instantly ————— */}
      <section className="paper-grain relative overflow-hidden">
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 pt-16 pb-14 sm:px-8 md:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">
              {hero.headline}
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
              {hero.subhead}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/contact" size="lg" className="pop-btn">
                {cta.primary}
              </ButtonLink>
              <ButtonLink href="/services" variant="secondary" size="lg" className="pop-btn">
                {cta.secondary}
              </ButtonLink>
            </div>
            <p className="mt-7 text-sm text-ink-faint">
              {hero.authorityStance}
            </p>
          </div>

          {/* Above-the-fold credibility cue */}
          <div className="rounded-[calc(var(--radius-card)+4px)] border border-forest/20 bg-panel p-6 shadow-card sm:p-7">
            <p className="eyebrow">{hero.credibilityCue.title}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {hero.credibilityCue.body}
            </p>
            <ButtonLink href="/contact" variant="secondary" size="md" className="pop-btn mt-5 w-full">
              {cta.primary}
            </ButtonLink>
          </div>
        </div>

        {/* Audience marquee — self-identification cue, decorative-only motion */}
        <div className="border-y border-line bg-paper-2/60 py-4">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-sm font-medium text-ink-soft">
              {[...icp.audiences, ...icp.audiences].map((a, i) => (
                <li key={i} className="flex items-center gap-10">
                  {a}
                  <span className="h-1 w-1 rounded-full bg-gold/70" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ————— Proof: Scorecard + testimonials + sourced stats ————— */}
      <section className="border-b border-line bg-panel">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <p className="eyebrow">{proof.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            {proof.title}
          </h2>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <PresenceScorecard />

            <div className="space-y-6">
              {proof.testimonials.map((t) => (
                <figure
                  key={t.name}
                  className="rounded-[var(--radius-card)] border border-line bg-paper p-6"
                >
                  <p className="text-xs font-bold uppercase tracking-wide text-gold-text">
                    {t.label}
                  </p>
                  <blockquote className="mt-2 font-serif text-lg leading-snug text-ink">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-3 text-sm text-ink-soft">
                    <span className="font-medium text-ink">{t.name}</span>,{" "}
                    {t.role}, {t.org}
                  </figcaption>
                </figure>
              ))}
              <p className="rounded-[var(--radius-card)] border border-dashed border-line-strong bg-paper-2/50 px-5 py-4 text-center text-xs font-medium text-ink-faint">
                {proof.logoRowLabel}
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-3">
            {proof.stats.map((s) => (
              <AnimatedStat key={s.label} {...s} />
            ))}
          </div>
        </div>
      </section>

      {/* ————— Services: outcome-first, one job per line ————— */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{servicesConfig.eyebrow}</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              {servicesConfig.title}
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-forest hover:underline"
          >
            See how it works →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicesConfig.items.map((s, i) => {
            const isLast = i === servicesConfig.items.length - 1;
            return (
              <div
                key={s.title}
                className={`rounded-[var(--radius-card)] bg-panel p-7 shadow-card sm:p-8 ${
                  isLast ? "sm:col-span-2 sm:flex sm:items-start sm:gap-6" : ""
                }`}
              >
                <span
                  className={`mb-5 grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest/10 text-2xl ${isLast ? "sm:mb-0" : ""}`}
                >
                  {s.emoji}
                </span>
                <div>
                  <h3 className="font-serif text-xl tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-forest/10 px-3 py-1.5 text-sm font-medium text-forest">
                    → {s.outcome}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ————— Pricing: visible on the homepage, not just a tab ————— */}
      <section className="border-t border-line bg-paper-2/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <PricingTiles compact />
        </div>
      </section>

      {/* ————— Selected work ————— */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 max-w-xl font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              Organizations that now look the part.
            </h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-forest hover:underline"
          >
            View all work →
          </Link>
        </div>
        <p className="mt-3 inline-block rounded-full border border-dashed border-line-strong bg-paper-2/60 px-3 py-1 text-xs font-medium text-ink-faint">
          [PLACEHOLDER: illustrative examples — real, named engagements replace these as they complete]
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {caseStudies
            .filter((study) => study.slug !== "riverside-arts-collective")
            .map((study) => (
              <CaseStudyCard key={study.slug} study={study} />
            ))}
        </div>
      </section>

      {/* ————— FAQ ————— */}
      <section className="border-t border-line bg-paper-2/50">
        <div className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 md:py-20">
          <p className="eyebrow">Questions</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            The honest answers.
          </h2>
          <div className="mt-8">
            <Faq />
          </div>
        </div>
      </section>

      {/* ————— CTA band — the one promise, one more time ————— */}
      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-[calc(var(--radius-card)+6px)] bg-forest px-7 py-14 text-paper sm:px-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-gold">Let&apos;s begin</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
              Give your organization the presence it&apos;s earned.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/85">
              {hero.credibilityCue.body}
            </p>
            <div className="mt-8">
              <ButtonLink
                href="/contact"
                size="lg"
                className="pop-btn !bg-none !bg-paper !text-forest hover:!bg-white"
              >
                {cta.primary}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
