/**
 * Monochrome line icons for the marketing site's service/process tiles —
 * replaces the raw emoji glyphs that used to sit there (🌐🎨🗓️🤝📊☕🔍🛠️🚀).
 * Emoji render in each OS's own multicolor palette (Windows' globe emoji is
 * blue), which broke the "no blue anywhere, one accent" rule outside of
 * CSS's control. Same `currentColor` stroke-icon pattern as the dashboard
 * sidebar's `Icon` component in `components/dashboard/sidebar.tsx`.
 */

const paths: Record<string, React.ReactNode> = {
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c3 3.5 3 14.5 0 18" />
      <path d="M12 3c-3 3.5-3 14.5 0 18" />
    </>
  ),
  palette: (
    <>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="8" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
      <rect x="13" y="13" width="8" height="8" rx="1.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </>
  ),
  people: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M3 20c0-3 2.5-5 5-5s5 2 5 5" />
      <path d="M11 20c0-3 2.5-5 5-5s5 2 5 5" />
    </>
  ),
  chart: <path d="M3 3v18h18M7 15l3-4 3 3 4-6" />,
  coffee: (
    <>
      <path d="M4 8h13v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
      <path d="M17 10h1a3 3 0 0 1 0 6h-1" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.35-4.35" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3l9 5-9 5-9-5 9-5z" />
      <path d="M3 13l9 5 9-5" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2l4 9-4 3-4-3 4-9z" />
      <circle cx="12" cy="9" r="1.3" />
      <path d="M9 15l-2 5M15 15l2 5" />
    </>
  ),
};

export type ServiceIconName = keyof typeof paths;

export function ServiceIcon({
  name,
  className,
}: {
  name: ServiceIconName;
  className?: string;
}) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
