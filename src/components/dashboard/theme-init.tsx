"use client";

import { useLayoutEffect } from "react";

const STORAGE_KEY = "meridian-theme";

/**
 * Applies the stored theme preference to the dashboard root before the
 * browser paints, so there's no visible flash of the wrong theme.
 * useLayoutEffect fires synchronously after the DOM is mounted but before
 * paint — unlike a raw <script> tag (which React 19 warns against
 * rendering as a JSX child, since script content isn't guaranteed to
 * execute outside the initial HTML parse), this is a normal, supported
 * React pattern. Renders nothing.
 */
export function ThemeInit() {
  useLayoutEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) ?? "system";
      const dark =
        stored === "dark" ||
        (stored === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      if (dark) {
        document
          .querySelector("[data-app-theme]")
          ?.setAttribute("data-theme", "dark");
      }
    } catch {
      // Storage unavailable — defaults to light.
    }
  }, []);

  return null;
}
