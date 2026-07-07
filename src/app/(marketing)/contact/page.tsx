import type { Metadata } from "next";
import { BookingForm } from "@/components/booking-form";
import { brand, contact } from "@/content/site.config";

export const metadata: Metadata = {
  title: "Book an intro call",
  description:
    "Book a short, no-pressure intro call to talk through your organization's presence. We reply within one business day.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 md:py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="eyebrow">{contact.eyebrow}</p>
          <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.06] tracking-tight text-ink sm:text-5xl">
            {contact.headline}
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
            {contact.subhead} Prefer email? Write to{" "}
            <a
              href={`mailto:${brand.contactEmail}`}
              className="text-forest underline underline-offset-4"
            >
              {brand.contactEmail}
            </a>
            .
          </p>

          <div className="mt-10 space-y-6 border-t border-line pt-8">
            {contact.expect.map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                <div>
                  <h2 className="font-semibold text-ink">{item.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 flex items-start gap-2 text-sm text-ink-faint">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
            We only ever use organic strategy and Meta&apos;s official,
            read-only insights API. We never post or automate actions on your
            account without your review.
          </p>
        </div>

        <div className="rounded-[calc(var(--radius-card)+4px)] border border-line bg-paper-2/40 p-6 sm:p-8">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
