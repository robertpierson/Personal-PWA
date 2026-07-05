import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { Reveal } from "@/components/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Book an intro call",
  description:
    "Book a short, no-pressure intro call to talk through your organization's presence. We reply within one business day.",
};

const expect = [
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
];

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow">Book an intro call</p>
            <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.06] tracking-tight text-ink sm:text-5xl">
              Let&apos;s talk about your presence.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
              Tell us a little about your organization and we&apos;ll reach out
              to schedule a time. Prefer email? Write to{" "}
              <a
                href={`mailto:${site.contactEmail}`}
                className="text-forest underline underline-offset-4"
              >
                {site.contactEmail}
              </a>
              .
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 space-y-6 border-t border-line pt-8">
              {expect.map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <span className="font-serif text-xl text-gold">
                    0{i + 1}
                  </span>
                  <div>
                    <h2 className="font-semibold text-ink">{item.title}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-10 flex items-start gap-2 text-sm text-ink-faint">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              We only ever use organic strategy and Meta&apos;s official,
              read-only insights API. We never post or automate actions on your
              account without your review.
            </p>
          </Reveal>
        </div>

        <Reveal delay={100}>
          <div className="rounded-[calc(var(--radius-card)+4px)] border border-line bg-paper-2/40 p-6 sm:p-8">
            <BookingForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
