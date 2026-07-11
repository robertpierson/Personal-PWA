import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Wordmark-first mark: a bracket frame (reads as "framing / featuring" —
 * the promise of the name) plus the wordmark, with its first letter in the
 * one brand accent. No circle/swoosh/globe — see brand.config.ts for the
 * name and CLAUDE.md for why that's a hard constraint here.
 */
export function Logo({
  className = "",
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  const [first, ...rest] = site.wordmark;
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      <svg
        aria-hidden
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="shrink-0 text-ink-faint transition-colors group-hover:text-gold"
      >
        <path
          d="M6.5 3H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13.5 3H16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-2.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-semibold tracking-tight text-ink">
          <span className="text-gold">{first}</span>
          {rest.join("")}
        </span>
        {showTagline && (
          <span className="mt-0.5 text-xs font-medium uppercase tracking-[0.2em] text-ink-faint">
            {site.tagline}
          </span>
        )}
      </span>
    </Link>
  );
}
