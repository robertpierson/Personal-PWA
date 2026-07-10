"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up from 0 to `value` once it scrolls into view, then holds. Every
 * stat requires a `source` — an unsourced number is a defect per the
 * conversion-audit brief, not a style choice.
 */
export function AnimatedStat({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  label,
  source,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  source: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => {
        setDisplay(value);
        setStarted(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setStarted(true);
          observer.unobserve(entry.target);

          const duration = 1400;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(value * eased);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className={started ? "stat-pop" : "opacity-0"}>
      <p className="figure text-3xl font-semibold text-gold-text sm:text-4xl">
        {prefix}
        {display.toFixed(decimals)}
        {suffix}
      </p>
      <p className="mt-1.5 text-sm font-medium text-ink-soft">{label}</p>
      <p className="mt-0.5 text-xs text-ink-faint">{source}</p>
    </div>
  );
}
