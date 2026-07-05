import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { CaseStudyCard } from "@/components/case-study-card";
import { caseStudies } from "@/content/case-studies";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected engagements — how we give community organizations a presence that reflects the quality of their work. Placeholder case studies while first engagements are underway.",
};

export default function WorkPage() {
  return (
    <>
      <section className="paper-grain mx-auto w-full max-w-6xl px-5 pt-16 pb-10 sm:px-8 md:pt-24">
        <Reveal>
          <p className="eyebrow">Selected work</p>
          <h1 className="mt-5 max-w-3xl font-serif text-4xl font-medium leading-[1.06] tracking-tight text-ink sm:text-6xl">
            Good organizations, looking the part.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            A look at how we build credible presence — the brand system, the
            calendar, and honest reporting. Every result here is organic; we
            never buy, bot, or automate.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-6 sm:px-8">
        <div className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/30 px-5 py-4 text-sm text-ink-soft">
          <strong className="font-semibold text-ink">
            A note on these examples:
          </strong>{" "}
          the case studies below are illustrative placeholders. We&apos;ll
          replace them with real, named engagements (with permission) as they
          complete.
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((study, i) => (
            <Reveal delay={i * 90} key={study.slug}>
              <CaseStudyCard study={study} detailed />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-24 sm:px-8">
        <Reveal>
          <div className="flex flex-col items-start gap-6 rounded-[var(--radius-card)] border border-line bg-panel px-7 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-12">
            <div>
              <h2 className="font-serif text-2xl tracking-tight text-ink sm:text-3xl">
                Could your organization be next?
              </h2>
              <p className="mt-2 text-ink-soft">
                Start with a short, no-pressure intro call.
              </p>
            </div>
            <ButtonLink href="/contact" size="lg">
              Book an intro call
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
