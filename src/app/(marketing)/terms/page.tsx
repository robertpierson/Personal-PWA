import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${site.name}.`,
};

export default function TermsPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink">
        Terms of Service
      </h1>
      <p className="mt-3 text-sm text-ink-faint">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>

      <div className="mt-10 space-y-8 leading-relaxed text-ink-soft [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-ink [&_h2]:tracking-tight [&_h2]:mb-2 [&_p]:mt-2">
        <section>
          <p>
            These terms govern your use of {site.name} and our services. They
            are provided as a starting point and should be reviewed by counsel
            before you rely on them.
          </p>
        </section>

        <section>
          <h2>Our services</h2>
          <p>
            We provide branded design, content planning, and reporting on
            organic social performance. Deliverables and scope are agreed in a
            separate proposal or statement of work.
          </p>
        </section>

        <section>
          <h2>Organic strategy only</h2>
          <p>
            We use only legitimate, organic strategy. We do not use bots,
            follow/unfollow schemes, purchased followers, or any automation that
            acts on your account. Nothing is published on your behalf without a
            human on your side reviewing it first.
          </p>
        </section>

        <section>
          <h2>Your responsibilities</h2>
          <p>
            You are responsible for the accuracy of information you provide, for
            maintaining your account credentials, and for ensuring you have the
            rights to any materials you share with us. Team-member logins have
            limited access and should only be given to people you authorize.
          </p>
        </section>

        <section>
          <h2>Payments</h2>
          <p>
            Fees are set out in your proposal or invoices and processed through
            Stripe. Invoices are due by the date stated. We may pause work on
            past-due accounts.
          </p>
        </section>

        <section>
          <h2>No guaranteed results</h2>
          <p>
            Social performance depends on many factors. We commit to
            professional, consistent work and honest reporting, but we do not
            guarantee specific follower, reach, or engagement outcomes.
          </p>
        </section>

        <section>
          <h2>Intellectual property</h2>
          <p>
            On full payment, you own the final delivered assets created for you.
            We may show non-confidential work in our portfolio unless you ask us
            not to.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            Either party may end the engagement with reasonable notice as set out
            in your agreement. You may disconnect integrations and request
            deletion of your data at any time.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a
              href={`mailto:${site.contactEmail}`}
              className="text-forest underline underline-offset-4"
            >
              {site.contactEmail}
            </a>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
