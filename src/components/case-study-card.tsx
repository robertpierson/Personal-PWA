import type { CaseStudy } from "@/content/case-studies";

const accentMap: Record<CaseStudy["accent"], string> = {
  forest: "from-panel to-paper-2 text-ink",
  gold: "from-gold to-gold-deep text-paper",
  ink: "from-paper-2 to-panel text-ink",
};

/**
 * Portfolio card. `detailed` shows the full challenge/work/outcome breakdown
 * (used on the Work page); the compact form is used on the landing preview.
 */
export function CaseStudyCard({
  study,
  detailed = false,
}: {
  study: CaseStudy;
  detailed?: boolean;
}) {
  return (
    <article className="tilt-card group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel">
      {/* Placeholder "cover" — a branded gradient panel standing in for imagery */}
      <div
        className={`relative flex aspect-[16/10] flex-col justify-between bg-gradient-to-br p-5 ${accentMap[study.accent]}`}
      >
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] opacity-90">
          <span>{study.category}</span>
          <span>{study.year}</span>
        </div>
        <div>
          <p className="font-serif text-2xl leading-tight">{study.client}</p>
          <p className="mt-1 text-sm opacity-85">{study.location}</p>
        </div>
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-serif text-6xl leading-none opacity-15">
          {study.client.charAt(0)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-serif text-lg leading-snug text-ink">
          {study.summary}
        </p>

        {detailed && (
          <div className="mt-5 space-y-4 text-sm text-ink-soft">
            <div>
              <p className="eyebrow mb-1.5">The challenge</p>
              <p className="leading-relaxed">{study.challenge}</p>
            </div>
            <div>
              <p className="eyebrow mb-1.5">What we did</p>
              <ul className="space-y-1.5">
                {study.work.map((w) => (
                  <li key={w} className="flex gap-2 leading-relaxed">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-1.5">Outcome</p>
              <p className="leading-relaxed">{study.outcome}</p>
            </div>
          </div>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
          {study.metrics.map((m) => (
            <div key={m.label}>
              <p className="figure text-xl font-semibold text-forest">{m.value}</p>
              <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
                {m.label}
              </p>
              {m.note && (
                <p className="mt-0.5 text-xs leading-tight text-ink-faint">
                  {m.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
