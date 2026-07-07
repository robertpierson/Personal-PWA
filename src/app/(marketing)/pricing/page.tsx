import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Faq } from "@/components/faq";
import { PricingTiles } from "@/components/pricing-tiles";
import { cta } from "@/content/site.config";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-5 pt-16 pb-10 sm:px-8 md:pt-24">
        <PricingTiles />
      </section>

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

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <div className="rounded-[calc(var(--radius-card)+6px)] bg-forest px-7 py-14 text-paper sm:px-14 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow eyebrow-gold">Still deciding?</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
              Book a free intro call, no pitch deck required.
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-paper/85">
              We&apos;ll help you figure out which tier actually makes sense
              for where you are right now.
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
