"use client";

import { useEffect, useState } from "react";

type ThemePref = "light" | "dark" | "system";
const STORAGE_KEY = "meridian-theme";

function applyTheme(pref: ThemePref) {
  const dark =
    pref === "dark" ||
    (pref === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  document
    .querySelector("[data-app-theme]")
    ?.setAttribute("data-theme", dark ? "dark" : "light");
}

const options: { value: ThemePref; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

/**
 * Reads/writes the theme preference from localStorage and flips the
 * `data-theme` attribute on the dashboard's root wrapper (see
 * (app)/dashboard/layout.tsx). A blocking inline script in that layout
 * already applies the stored preference before first paint — this only
 * handles subsequent changes and the live "system" media-query listener.
 */
export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePref>("system");

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemePref | null;
      if (stored) setPref(stored);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  function choose(next: ThemePref) {
    setPref(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <div className="flex flex-wrap gap-2 p-5">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => choose(opt.value)}
          aria-pressed={pref === opt.value}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            pref === opt.value
              ? "bg-forest text-paper"
              : "border border-line-strong text-ink-soft hover:border-forest hover:text-forest"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
