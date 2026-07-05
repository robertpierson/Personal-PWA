import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses, and protects your information.`,
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-16 sm:px-8 md:py-24">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-ink">
        Privacy Policy
      </h1>
      <p className="mt-3 text-sm text-ink-faint">
        Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>

      <div className="mt-10 space-y-8 leading-relaxed text-ink-soft [&_h2]:font-serif [&_h2]:text-xl [&_h2]:text-ink [&_h2]:tracking-tight [&_h2]:mb-2 [&_p]:mt-2">
        <section>
          <p>
            This policy explains what information {site.name} (“we”, “us”)
            collects, how we use it, and the choices you have. It is written to
            be readable; it is not a substitute for legal advice, and you should
            have it reviewed by counsel before relying on it in production.
          </p>
        </section>

        <section>
          <h2>Information we collect</h2>
          <p>
            <strong>Contact details</strong> you provide when you request an
            intro call or become a client (name, email, organization, and what
            you tell us about your goals).
          </p>
          <p>
            <strong>Account information</strong> for the client dashboard,
            managed through our authentication provider.
          </p>
          <p>
            <strong>Instagram insights</strong>, only if you explicitly connect
            your Instagram Business account. See “Instagram data” below.
          </p>
          <p>
            <strong>Payment information</strong> is handled by our payment
            processor (Stripe). We do not store your full card details.
          </p>
        </section>

        <section>
          <h2>Instagram data (Meta Graph API)</h2>
          <p>
            If you connect your account, we access your Instagram insights
            through Meta&apos;s official Graph API on a strictly{" "}
            <strong>read-only</strong> basis — metrics such as reach,
            engagement, follower counts, and profile views. We use this data
            only to report on your performance inside your dashboard.
          </p>
          <p>
            We <strong>never</strong> post, comment, follow, like, or take any
            action on your account, and we never use bots or automation. You can
            disconnect at any time, which stops further data collection; we
            delete stored insights on request.
          </p>
        </section>

        <section>
          <h2>How we use information</h2>
          <p>
            To provide our services, communicate with you, produce and report on
            your content, process payments, and improve what we offer. We do not
            sell your personal information.
          </p>
        </section>

        <section>
          <h2>Sharing</h2>
          <p>
            We share information only with service providers that help us operate
            (for example, hosting, database, authentication, and payments), and
            only as needed. These providers are bound by their own privacy
            commitments.
          </p>
        </section>

        <section>
          <h2>Data retention &amp; security</h2>
          <p>
            We keep information for as long as needed to provide the service and
            meet legal obligations. Connected-account tokens are encrypted at
            rest. No system is perfectly secure, but we take reasonable measures
            to protect your data.
          </p>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            You can request access to, correction of, or deletion of your
            information, and you can disconnect integrations at any time. Contact
            us to make a request.
          </p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{" "}
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
