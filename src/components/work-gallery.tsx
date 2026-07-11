const items = [
  {
    title: "Website design",
    caption: "A modern site, built and hosted for you.",
    icon: "🖥️",
    accent: "from-panel to-paper-2",
  },
  {
    title: "Social content",
    caption: "On-brand graphics for every post.",
    icon: "🎨",
    accent: "from-gold to-gold-deep",
  },
  {
    title: "Content calendar",
    caption: "A season mapped to your real programming.",
    icon: "🗓️",
    accent: "from-paper-2 to-panel",
  },
  {
    title: "Insights report",
    caption: "Plain-English numbers, every month.",
    icon: "📊",
    accent: "from-gold-deep to-gold",
  },
] as const;

/**
 * Stand-ins for real work photography — deliberately stylized (icon +
 * gradient) rather than fake-photorealistic, so nothing here is ever
 * mistaken for a real screenshot per the site's honesty standard. Swap each
 * frame for a real image when engagements complete.
 */
export function WorkGallery() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {items.map((item) => (
        <figure
          key={item.title}
          className="group overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-lift"
        >
          <div
            className={`flex aspect-square items-center justify-center bg-gradient-to-br ${item.accent}`}
          >
            <span className="text-4xl opacity-90 transition-transform duration-200 group-hover:scale-110 sm:text-5xl">
              {item.icon}
            </span>
          </div>
          <figcaption className="p-3">
            <p className="text-sm font-semibold text-ink">{item.title}</p>
            <p className="mt-0.5 text-xs leading-snug text-ink-faint">
              {item.caption}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
