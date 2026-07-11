/**
 * Brand identity — single source of truth for the studio name and accent
 * color. Change `name` or `accent` here to rebrand; `site.config.ts` reads
 * `name` for `brand.name`/`brand.wordmark`, and `layout.tsx` writes `accent`
 * onto the root element as inline CSS custom properties, which win over the
 * defaults baked into `globals.css` (inline style has higher specificity
 * than any stylesheet rule for the same property) — so this file is the
 * actual runtime source of truth for the accent color, not just documentation.
 */

// One-line alternates — swap `name` to any of these to rebrand:
// "Civic" | "Commons" | "Bearing" | "Fieldwork"
export const name = "Marquee";

/** Warm gold — the one brand accent. Keep `contrast` equal to `--bg` in globals.css. */
export const accent = {
  base: "#E6B24A",
  hover: "#F0C15E",
  contrast: "#0B0B0C",
} as const;
