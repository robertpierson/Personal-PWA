"use client";

import { useState } from "react";

export function PayButton({
  invoiceId,
  demo,
}: {
  invoiceId: string;
  demo: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pay() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Could not start checkout.");
      if (body.url) window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={pay}
        disabled={loading}
        title={demo ? "Connect Stripe to enable payments" : undefined}
        className="inline-flex h-9 items-center rounded-full bg-forest px-4 text-sm font-medium text-paper transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {loading ? "Starting…" : "Pay now"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
