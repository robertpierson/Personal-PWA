const items = [
  {
    title: "Website design",
    caption: "[PLACEHOLDER: screenshot of a client website]",
    icon: "🖥️",
    accent: "from-forest to-forest-deep",
  },
  {
    title: "Social content",
    caption: "[PLACEHOLDER: designed Instagram post examples]",
    icon: "🎨",
    accent: "from-gold to-gold-deep",
  },
  {
    title: "Content calendar",
    caption: "[PLACEHOLDER: a real season's content calendar]",
    icon: "🗓️",
    accent: "from-forest-deep to-forest",
  },
  {
    title: "Insights report",
    caption: "[PLACEHOLDER: a monthly reporting screenshot]",
    icon: "📊",
    accent: "from-gold-deep to-gold",
  },
] as const;

/**
 * Placeholder frames for real work photography — deliberately stylized
 * (icon + gradient + bracketed caption) rather than fake-photorealistic, so
 * nothing here is ever mistaken for a real screenshot per the site's honesty
 * standard. Swap each frame for a real image when engagements complete.
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
