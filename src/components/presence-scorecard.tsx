"use client";

import { useEffect, useRef, useState } from "react";
import { scorecard } from "@/content/site.config";

/**
 * The signature element (see DESIGN_NOTES.md §"Signature element"): the
 * checklist a funder or board member actually runs before trusting an
 * organization. Ticks in once, staggered, when it scrolls into view — this
 * and the stat counters in AnimatedStat are the ONLY scroll-triggered
 * motion on the site (see globals.css "Motion system").
 */
export function PresenceScorecard() {
  const ref = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() =>
        setVisibleCount(scorecard.items.length),
      );
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          scorecard.items.forEach((_, i) => {
            setTimeout(() => setVisibleCount((c) => Math.max(c, i + 1)), i * 220);
          });
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-[calc(var(--radius-card)+4px)] border border-line bg-panel p-7 sm:p-9"
    >
      <p className="eyebrow">{scorecard.eyebrow}</p>
      <h3 className="mt-3 font-serif text-2xl tracking-tight text-ink sm:text-3xl">
        {scorecard.title}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
        {scorecard.body}
      </p>

      <ul className="mt-6 space-y-3 border-t border-line pt-6">
        {scorecard.items.map((item, i) => {
          const shown = i < visibleCount;
          return (
            <li
              key={item}
              className={`flex items-start gap-3 ${shown ? "check-in" : "opacity-0"}`}
            >
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold text-ink">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                  <path
                    d="M2 6.5l2.5 2.5L10 3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm leading-relaxed text-ink">{item}</span>
            </li>
          );
        })}
      </ul>

      <p className="mt-6 border-t border-line pt-5 text-xs leading-relaxed text-ink-faint">
        {scorecard.methodNote}
      </p>
    </div>
  );
}
