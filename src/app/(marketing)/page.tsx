import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { CaseStudyCard } from "@/components/case-study-card";
import { Faq } from "@/components/faq";
import { caseStudies } from "@/content/case-studies";
import { audiences, site } from "@/lib/site";

const services = [
  {
    n: "01",
    title: "Branded design content",
    body: "A visual system and post templates built for your organization — so every graphic looks deliberate, consistent, and unmistakably yours. Not a canva-scramble.",
    points: ["Identity & template kit", "On-brand graphics", "Board-ready one-pagers"],
  },
  {
    n: "02",
    title: "A real content calendar",
    body: "A plan mapped to your actual programming and season — what to post, when, and why. You always know what's next, and nothing goes out that you haven't reviewed.",
    points: ["Mapped to your calendar", "You approve everything", "Consistent cadence"],
  },
  {
    n: "03",
    title: "Honest Instagram insights",
    body: "With your permission we read your account's real metrics through Meta's official API — reach, engagement, growth over time — and report them straight. No inflation, no bots.",
    points: ["Official Graph API", "Read-only, you consent", "No bots, ever"],
  },
];

const approach = [
  {
    n: "01",
    title: "Intro call",
    body: "A short, no-pressure conversation about your organization, your audience, and what a credible presence would unlock.",
  },
  {
    n: "02",
    title: "Presence audit",
    body: "We assess how you look today and where the gaps are — the honest version a board member would never tell you.",
  },
  {
    n: "03",
    title: "Build & calendar",
    body: "We design the system and lay out a content calendar tied to your programming, with you approving the direction.",
  },
  {
    n: "04",
    title: "Run & report",
    body: "Consistent, reviewed content — and a plain-English insights review so you can see it working.",
  },
];

const values = [
  {
    title: "Grant applications",
    body: "Funders quietly check your socials. A serious presence signals a serious, well-run organization — before anyone reads a word of your proposal.",
  },
  {
    title: "College & credibility",
    body: "For the students and organizers behind the work, a professionally run presence is proof of leadership that stands up to scrutiny.",
  },
  {
    title: "Community trust",
    body: "Neighbors, sponsors, and volunteers decide in seconds whether you look established. We make sure the answer is yes.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ————— Hero ————— */}
      <section className="paper-grain relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-5 pt-16 pb-20 sm:px-8 md:pt-24 md:pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-3">
                <span className="h-px w-8 bg-forest/50" />
                {site.tagline}
              </p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-6 font-serif text-[2.6rem] font-medium leading-[1.05] tracking-tight text-ink sm:text-6xl">
                We make community organizations look as{" "}
                <span className="text-forest italic">serious</span> as the work
                they do.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
                Meridian gives nonprofits, community groups, and local
                businesses a professional public presence — branded design, a
                real content calendar, and honest Instagram insights. No bots.
                No growth hacks. Just organizations that finally look the way
                they deserve to.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink href="/contact" size="lg">
                  Book an intro call
                </ButtonLink>
                <ButtonLink href="/work" variant="secondary" size="lg">
                  See the work
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 flex items-center gap-2 text-sm text-ink-faint">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                Organic strategy only — we never automate actions on your
                account.
              </p>
            </Reveal>
          </div>

          {/* Presence card — stylized profile preview */}
          <Reveal delay={160} className="lg:justify-self-end">
            <HeroPresenceCard />
          </Reveal>
        </div>

        {/* Audience marquee */}
        <div className="border-y border-line bg-paper-2/60 py-4">
          <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="marquee-track flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 text-sm font-medium text-ink-soft">
              {[...audiences, ...audiences].map((a, i) => (
                <li key={i} className="flex items-center gap-10">
                  {a}
                  <span className="h-1 w-1 rounded-full bg-gold/70" />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ————— Positioning: not growth hacks ————— */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">The difference</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              Presence, not follower-count theater.
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Anyone can inflate a number. It doesn&apos;t survive the moment a
              grant officer, sponsor, or admissions reader actually looks. We
              build the thing that does: a credible, consistent presence that
              reflects how well your organization is really run.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[var(--radius-card)] border border-line bg-panel p-6">
                <p className="eyebrow text-ink-faint">What we don&apos;t do</p>
                <ul className="mt-4 space-y-3 text-sm text-ink-soft">
                  {[
                    "Buy or bot followers",
                    "Follow / unfollow schemes",
                    "Post without your review",
                    "Fabricate metrics",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2.5">
                      <CrossIcon />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[var(--radius-card)] border border-forest/25 bg-forest p-6 text-paper">
                <p className="eyebrow text-gold-soft">What we do</p>
                <ul className="mt-4 space-y-3 text-sm text-paper/90">
                  {[
                    "Design a real brand system",
                    "Plan a content calendar",
                    "You approve every post",
                    "Report insights honestly",
                  ].map((x) => (
                    <li key={x} className="flex items-start gap-2.5">
                      <CheckIcon />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ————— Services ————— */}
      <section id="services" className="border-t border-line bg-paper-2/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <Reveal>
            <SectionHeading
              label="What you get"
              title="Three things, done properly."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {services.map((s, i) => (
              <Reveal as="article" delay={i * 90} key={s.n}>
                <div className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-panel p-7">
                  <div className="flex items-baseline justify-between">
                    <span className="font-serif text-4xl text-gold">{s.n}</span>
                  </div>
                  <h3 className="mt-5 font-serif text-2xl tracking-tight text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                  <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-ink">
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Approach ————— */}
      <section id="approach" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <Reveal>
          <SectionHeading
            label="How it works"
            title="A calm, four-step process."
          />
        </Reveal>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((step, i) => (
            <Reveal as="div" delay={i * 80} key={step.n} className="bg-panel">
              <div className="flex h-full flex-col p-7">
                <span className="font-serif text-3xl text-forest">
                  {step.n}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ————— Work preview ————— */}
      <section className="border-t border-line bg-paper-2/50">
        <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionHeading
                label="Selected work"
                title="Organizations that now look the part."
              />
              <ButtonLink href="/work" variant="secondary">
                View all work
              </ButtonLink>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {caseStudies.map((study, i) => (
              <Reveal delay={i * 90} key={study.slug}>
                <CaseStudyCard study={study} />
              </Reveal>
            ))}
          </div>
          <p className="mt-8 text-xs text-ink-faint">
            Case studies shown are illustrative placeholders while our first
            client engagements are underway.
          </p>
        </div>
      </section>

      {/* ————— Why it matters ————— */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="eyebrow">Why it matters</p>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
              The people who fund and join you are already looking.
            </h2>
          </Reveal>
          <div className="grid gap-8 sm:grid-cols-3">
            {values.map((v, i) => (
              <Reveal delay={i * 90} key={v.title}>
                <div className="border-t border-forest/30 pt-5">
                  <h3 className="font-serif text-xl text-ink">{v.title}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">
                    {v.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ————— FAQ ————— */}
      <section className="border-t border-line bg-paper-2/50">
        <div className="mx-auto w-full max-w-3xl px-5 py-20 sm:px-8 md:py-28">
          <Reveal>
            <SectionHeading label="Questions" title="The honest answers." />
          </Reveal>
          <div className="mt-10">
            <Faq />
          </div>
        </div>
      </section>

      {/* ————— CTA band ————— */}
      <section className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
        <Reveal>
          <div className="paper-grain relative overflow-hidden rounded-[calc(var(--radius-card)+6px)] bg-forest px-7 py-14 text-paper sm:px-14 sm:py-20">
            <div className="relative z-10 max-w-2xl">
              <p className="eyebrow text-gold-soft">Let&apos;s begin</p>
              <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-5xl">
                Give your organization the presence it&apos;s earned.
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-paper/85">
                Book a short intro call. We&apos;ll talk through where you are
                and what a credible presence would look like — no obligation.
              </p>
              <div className="mt-8">
                <ButtonLink
                  href="/contact"
                  size="lg"
                  className="bg-paper text-forest hover:bg-white"
                >
                  Book an intro call
                </ButtonLink>
              </div>
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full border border-paper/15"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 right-24 h-72 w-72 rounded-full border border-paper/10"
            />
          </div>
        </Reveal>
      </section>
    </>
  );
}

function SectionHeading({ label, title }: { label: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{label}</p>
      <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function HeroPresenceCard() {
  const tiles = ["from-forest to-forest-deep", "from-gold to-[#8f6a26]", "from-ink to-[#2b2f38]"];
  return (
    <div className="w-full max-w-sm rounded-[calc(var(--radius-card)+4px)] border border-line bg-panel p-5 shadow-[0_28px_60px_-32px_rgba(22,24,29,0.4)]">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-forest to-forest-deep font-serif text-xl text-paper ring-2 ring-gold/60">
          R
        </div>
        <div className="flex-1">
          <p className="font-semibold text-ink">Riverside Arts Collective</p>
          <p className="text-sm text-ink-faint">@riversidearts · Nonprofit</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-paper-2/70 p-3 text-center">
        {[
          { k: "Reach", v: "3.4×" },
          { k: "Engaged", v: "6.1%" },
          { k: "Posting", v: "Weekly" },
        ].map((s) => (
          <div key={s.k}>
            <p className="font-serif text-lg text-forest">{s.v}</p>
            <p className="text-[0.62rem] font-medium uppercase tracking-wide text-ink-faint">
              {s.k}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {tiles.map((t, i) => (
          <div
            key={i}
            className={`relative aspect-square overflow-hidden rounded-lg bg-gradient-to-br ${t}`}
          >
            <span className="absolute bottom-1.5 left-2 font-serif text-xs text-paper/80">
              0{i + 1}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl border border-line px-4 py-3">
        <span className="text-xs font-medium text-ink-soft">
          Next in calendar
        </span>
        <span className="text-xs text-ink-faint">Spring season launch →</span>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 shrink-0"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M3 8.5l3 3 7-7.5"
        stroke="var(--color-gold-soft)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg
      className="mt-0.5 shrink-0"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
    >
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="var(--color-ink-faint)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
