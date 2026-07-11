"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "marquee-notification-prefs";

const defaults = {
  deliverableReady: true,
  weeklyDigest: true,
  invoiceReminders: true,
  productUpdates: false,
};

type Prefs = typeof defaults;

const items: { key: keyof Prefs; label: string; body: string }[] = [
  {
    key: "deliverableReady",
    label: "New deliverable ready",
    body: "Get an email when a design or report is ready for review.",
  },
  {
    key: "weeklyDigest",
    label: "Weekly insights digest",
    body: "A short summary of the week's reach and engagement.",
  },
  {
    key: "invoiceReminders",
    label: "Invoice reminders",
    body: "A heads-up a few days before an invoice is due.",
  },
  {
    key: "productUpdates",
    label: "Product updates",
    body: "Occasional notes about new dashboard features.",
  },
];

/**
 * Local-device notification preferences. Deliberately not wired to a
 * backend table (none exists yet) — persisted to localStorage only, and
 * labeled as such, rather than implying a synced setting it isn't.
 */
export function NotificationPreferences() {
  const [prefs, setPrefs] = useState<Prefs>(defaults);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) setPrefs({ ...defaults, ...JSON.parse(stored) });
      } catch {
        // Ignore malformed/unavailable storage — defaults already applied.
      }
      setLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  function toggle(key: keyof Prefs) {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="divide-y divide-line">
      {items.map(({ key, label, body }) => {
        const checked = loaded && prefs[key];
        return (
          <label
            key={key}
            className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4"
          >
            <span>
              <span className="block font-medium text-ink">{label}</span>
              <span className="block text-sm text-ink-soft">{body}</span>
            </span>
            <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={checked}
                onChange={() => toggle(key)}
              />
              <span className="absolute inset-0 rounded-full bg-line-strong transition-colors peer-checked:bg-forest" />
              <span className="absolute left-0.5 h-5 w-5 rounded-full bg-panel shadow-crisp transition-transform peer-checked:translate-x-5" />
            </span>
          </label>
        );
      })}
      <p className="px-5 py-3 text-xs text-ink-faint">
        Saved to this device. Sync across devices becomes available once
        account sync is configured.
      </p>
    </div>
  );
}
