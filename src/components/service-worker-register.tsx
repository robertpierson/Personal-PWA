"use client";

import { useEffect } from "react";

/**
 * Registers the custom service worker (public/sw.js) for installability and
 * offline caching of visited pages. No-ops in browsers without SW support and
 * skips registration during local HTTP dev unless explicitly enabled.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    // Only register on secure origins (https or localhost).
    const isSecure =
      window.isSecureContext || window.location.hostname === "localhost";
    if (!isSecure) return;

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((err) => {
          console.error("Service worker registration failed:", err);
        });
    };

    // Register after load so it never competes with first paint.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
