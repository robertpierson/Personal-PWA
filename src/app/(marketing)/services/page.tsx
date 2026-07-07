import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { CaseStudyCard } from "@/components/case-study-card";
import { caseStudies } from "@/content/case-studies";
import { cta, services } from "@/content/site.config";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-10 sm:px-8 md:pt-24">
        <p className="eyebrow">{services.eyebrow}</p>
        <h1 className="mt-4 font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
          {services.title}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
          {services.subhead}
        </p>
      </section>

      {/* Outcome-first list — one job per row, fast to scan */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8">
        <div className="divide-y divide-line overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel">
          {services.items.map((s) => (
            <div
              key={s.title}
              className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:p-7"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest/10 text-2xl">
                {s.emoji}
              </span>
              <div className="min-w-0">
                <h2 className="font-serif text-xl tracking-tight text-ink sm:text-2xl">
                  {s.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
                  {s.body}
                </p>
                <p className="mt-2 text-sm font-medium text-forest">
                  → {s.outcome}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ————— How it works ————— */}
      <section className="border-t border-line bg-paper-2/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            A calm, four-step process.
          </h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {services.approach.map((step) => (
              <div key={step.n} className="bg-panel p-6">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl text-forest">
                    {step.n}
                  </span>
                  <span className="text-xl">{step.emoji}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-ink-soft">
            Curious what it costs? It&apos;s cheaper than you think.
          </p>
          <ButtonLink href="/pricing" size="lg" className="pop-btn">
            See pricing
          </ButtonLink>
        </div>
      </section>

      {/* ————— Selected work ————— */}
      <section className="border-t border-line bg-paper-2/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-20">
          <p className="eyebrow">Selected work</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
            Good organizations, looking the part.
          </h2>
          <p className="mt-4 inline-block rounded-full border border-dashed border-line-strong bg-paper-2/60 px-3 py-1 text-xs font-medium text-ink-faint">
            [PLACEHOLDER: illustrative examples — real, named engagements replace these as they complete]
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study) => (
              <CaseStudyCard key={study.slug} study={study} detailed />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-start gap-6 rounded-[var(--radius-card)] border border-line bg-panel px-7 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12">
          <div>
            <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">
              Could your organization be next?
            </h2>
            <p className="mt-2 text-ink-soft">
              Start with a short, no-pressure intro call.
            </p>
          </div>
          <ButtonLink href="/contact" size="lg" className="pop-btn">
            {cta.primary}
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
