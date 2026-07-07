import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOperator } from "@/lib/operator";
import {
  adminGetCalendar,
  adminGetDeliverables,
  adminGetInvoices,
  adminGetOrg,
} from "@/lib/data/admin";
import {
  createCalendarItem,
  createDeliverable,
  createInvoice,
  deleteCalendarItem,
  deleteDeliverable,
  deleteInvoice,
  setDeliverableStatus,
} from "@/app/admin/actions";
import {
  Panel,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@/components/dashboard/primitives";

export const metadata: Metadata = { title: "Operator · Manage client" };

const fc =
  "w-full rounded-lg border border-line-strong bg-panel px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const del =
  "text-xs font-medium text-red-600 hover:underline disabled:opacity-40";
const submitBtn =
  "justify-self-start rounded-full bg-forest px-4 py-2 text-sm font-medium text-paper transition-colors duration-200 hover:bg-forest-deep focus:outline-none focus:ring-2 focus:ring-forest/20";

export default async function ManageOrgPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [op, org] = await Promise.all([getOperator(), adminGetOrg(id)]);
  if (!org) notFound();
  const readOnly = op?.demo ?? true;

  const [deliverables, calendar, invoices] = await Promise.all([
    adminGetDeliverables(id),
    adminGetCalendar(id),
    adminGetInvoices(id),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-sm text-forest hover:underline">
          ← All clients
        </Link>
        <h1 className="mt-2 font-serif text-3xl tracking-tight text-ink">
          {org.name}
        </h1>
        <p className="text-ink-soft">{org.type}</p>
      </div>

      {readOnly && (
        <p className="rounded-[var(--radius-card)] border border-gold/30 bg-gold-soft/30 px-5 py-3 text-sm text-ink-soft">
          Demo mode — data shown is sample content and editing is disabled.
          Connect Supabase to manage this client for real.
        </p>
      )}

      {/* Deliverables */}
      <Panel title="Deliverables">
        <ul className="divide-y divide-line">
          {deliverables.map((d) => (
            <li
              key={d.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{d.title}</p>
                <p className="text-xs text-ink-faint">
                  {d.type} · due {formatDate(d.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {readOnly ? (
                  <StatusBadge status={d.status} />
                ) : (
                  <form
                    action={setDeliverableStatus.bind(null, id, d.id)}
                    className="flex items-center gap-2"
                  >
                    <select
                      name="status"
                      aria-label={`Status for ${d.title}`}
                      defaultValue={d.status}
                      className={fc}
                    >
                      <option value="not_started">Not started</option>
                      <option value="in_progress">In progress</option>
                      <option value="in_review">In review</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <button className="text-xs font-medium text-forest hover:underline">
                      Save
                    </button>
                  </form>
                )}
                <form action={deleteDeliverable.bind(null, id, d.id)}>
                  <button className={del} disabled={readOnly}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
          {deliverables.length === 0 && (
            <li className="px-5 py-4 text-sm text-ink-faint">None yet.</li>
          )}
        </ul>
        {!readOnly && (
          <form
            action={createDeliverable.bind(null, id)}
            className="grid gap-3 border-t border-line p-5 sm:grid-cols-2"
          >
            <input name="title" required placeholder="Title" aria-label="Title" className={fc} />
            <input name="type" placeholder="Type (e.g. Design)" aria-label="Type" className={fc} defaultValue="Design" />
            <input name="dueDate" type="date" aria-label="Due date" className={fc} />
            <select name="status" aria-label="Status" className={fc} defaultValue="not_started">
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="in_review">In review</option>
              <option value="delivered">Delivered</option>
            </select>
            <input name="description" placeholder="Short description" aria-label="Short description" className={`${fc} sm:col-span-2`} />
            <button className={submitBtn}>Add deliverable</button>
          </form>
        )}
      </Panel>

      {/* Calendar */}
      <Panel title="Content calendar">
        <ul className="divide-y divide-line">
          {calendar.map((c) => (
            <li
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{c.title}</p>
                <p className="text-xs text-ink-faint">
                  {formatDate(c.date)} · {c.channel} · {c.format}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={c.status} />
                <form action={deleteCalendarItem.bind(null, id, c.id)}>
                  <button className={del} disabled={readOnly}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
          {calendar.length === 0 && (
            <li className="px-5 py-4 text-sm text-ink-faint">None yet.</li>
          )}
        </ul>
        {!readOnly && (
          <form
            action={createCalendarItem.bind(null, id)}
            className="grid gap-3 border-t border-line p-5 sm:grid-cols-2"
          >
            <input name="title" required placeholder="Title" aria-label="Title" className={fc} />
            <input name="date" type="date" aria-label="Date" className={fc} />
            <select name="channel" aria-label="Channel" className={fc} defaultValue="instagram">
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="newsletter">Newsletter</option>
              <option value="other">Other</option>
            </select>
            <select name="format" aria-label="Format" className={fc} defaultValue="post">
              <option value="post">Post</option>
              <option value="reel">Reel</option>
              <option value="story">Story</option>
              <option value="carousel">Carousel</option>
              <option value="email">Email</option>
            </select>
            <select name="status" aria-label="Status" className={fc} defaultValue="idea">
              <option value="idea">Idea</option>
              <option value="drafting">Drafting</option>
              <option value="scheduled">Scheduled</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
            </select>
            <input name="caption" placeholder="Caption" aria-label="Caption" className={fc} />
            <button className={submitBtn}>Add to calendar</button>
          </form>
        )}
      </Panel>

      {/* Invoices */}
      <Panel title="Invoices">
        <ul className="divide-y divide-line">
          {invoices.map((inv) => (
            <li
              key={inv.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">
                  {inv.number} · {formatCurrency(inv.amountCents, inv.currency)}
                </p>
                <p className="text-xs text-ink-faint">
                  {inv.description} · due {formatDate(inv.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={inv.status} />
                <form action={deleteInvoice.bind(null, id, inv.id)}>
                  <button className={del} disabled={readOnly}>
                    Delete
                  </button>
                </form>
              </div>
            </li>
          ))}
          {invoices.length === 0 && (
            <li className="px-5 py-4 text-sm text-ink-faint">None yet.</li>
          )}
        </ul>
        {!readOnly && (
          <form
            action={createInvoice.bind(null, id)}
            className="grid gap-3 border-t border-line p-5 sm:grid-cols-2"
          >
            <input name="number" required placeholder="Invoice # (e.g. MER-2026-022)" aria-label="Invoice number" className={fc} />
            <input name="amount" type="number" step="0.01" min="0" required placeholder="Amount (USD)" aria-label="Amount (USD)" className={fc} />
            <input name="description" placeholder="Description" aria-label="Description" className={fc} />
            <input name="dueDate" type="date" aria-label="Due date" className={fc} />
            <select name="status" aria-label="Status" className={fc} defaultValue="open">
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="paid">Paid</option>
              <option value="void">Void</option>
            </select>
            <button className={submitBtn}>Add invoice</button>
          </form>
        )}
      </Panel>
    </div>
  );
}
