import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Meridian wordmark. The mark is a simple meridian line + point drawn inline so
 * it stays crisp at any size and inherits currentColor.
 */
export function Logo({
  className = "",
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span
        aria-hidden
        className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-forest/30 text-forest transition-colors group-hover:border-forest"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle
            cx="9"
            cy="9"
            r="7.25"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.55"
          />
          <path
            d="M9 1.75V16.25"
            stroke="currentColor"
            strokeWidth="1.1"
            opacity="0.55"
          />
          <circle cx="9" cy="6.1" r="1.9" fill="var(--color-gold)" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-semibold tracking-tight text-ink">
          {site.wordmark}
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
