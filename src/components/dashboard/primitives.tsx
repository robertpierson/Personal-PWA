import type { ReactNode } from "react";
import type {
  CalendarStatus,
  DeliverableStatus,
  InvoiceStatus,
} from "@/lib/types";

/** Small labeled status pill with a consistent color language. */
export function StatusBadge({
  status,
}: {
  status: DeliverableStatus | CalendarStatus | InvoiceStatus;
}) {
  const map: Record<string, { label: string; className: string }> = {
    // Deliverables
    not_started: { label: "Not started", className: "bg-paper-2 text-ink-faint" },
    in_progress: { label: "In progress", className: "bg-gold-soft/50 text-[#7a5c1f]" },
    in_review: { label: "In review", className: "bg-forest/10 text-forest" },
    delivered: { label: "Delivered", className: "bg-forest text-paper" },
    // Calendar
    idea: { label: "Idea", className: "bg-paper-2 text-ink-faint" },
    drafting: { label: "Drafting", className: "bg-gold-soft/50 text-[#7a5c1f]" },
    scheduled: { label: "Scheduled", className: "bg-forest/10 text-forest" },
    approved: { label: "Approved", className: "bg-forest/15 text-forest" },
    published: { label: "Published", className: "bg-forest text-paper" },
    // Invoices
    draft: { label: "Draft", className: "bg-paper-2 text-ink-faint" },
    open: { label: "Open", className: "bg-gold-soft/50 text-[#7a5c1f]" },
    paid: { label: "Paid", className: "bg-forest text-paper" },
    void: { label: "Void", className: "bg-paper-2 text-ink-faint line-through" },
  };
  const { label, className } = map[status] ?? {
    label: status,
    className: "bg-paper-2 text-ink-faint",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

/** Headline metric card. */
export function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border p-5 ${
        accent
          ? "border-forest/25 bg-forest text-paper"
          : "border-line bg-panel"
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${accent ? "text-gold-soft" : "text-ink-faint"}`}
      >
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl tracking-tight">{value}</p>
      {sub && (
        <p
          className={`mt-1 text-sm ${accent ? "text-paper/80" : "text-ink-soft"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

/** Section container used across dashboard pages. */
export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[var(--radius-card)] border border-line bg-panel ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          {title && (
            <h2 className="font-serif text-lg tracking-tight text-ink">
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl tracking-tight text-ink">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-ink-soft">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function formatCurrency(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
