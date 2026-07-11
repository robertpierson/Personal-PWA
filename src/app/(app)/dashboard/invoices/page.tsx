import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getInvoices } from "@/lib/data/dashboard";
import {
  PageHeader,
  Panel,
  StatCard,
  StatusBadge,
  formatCurrency,
  formatDate,
} from "@/components/dashboard/primitives";
import { PayButton } from "@/components/dashboard/pay-button";

export const metadata: Metadata = { title: "Invoices" };

export default async function InvoicesPage() {
  const session = await requireSession();
  if (session.member.role !== "owner") redirect("/dashboard");

  const invoices = await getInvoices(session);
  const outstanding = invoices
    .filter((i) => i.status === "open" || i.status === "draft")
    .reduce((sum, i) => sum + i.amountCents, 0);
  const paidThisYear = invoices
    .filter((i) => i.status === "paid")
    .reduce((sum, i) => sum + i.amountCents, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Invoices"
        description="Your billing history and anything currently outstanding."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label="Outstanding"
          value={formatCurrency(outstanding)}
          sub="Across open invoices"
          accent={outstanding > 0}
        />
        <StatCard label="Paid this year" value={formatCurrency(paidThisYear)} />
      </div>

      <Panel title="All invoices">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-5 py-3 font-medium">Invoice</th>
                <th className="px-5 py-3 font-medium">Issued</th>
                <th className="px-5 py-3 font-medium">Due</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-ink">{inv.number}</p>
                    <p className="text-xs text-ink-faint">{inv.description}</p>
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {formatDate(inv.issuedDate)}
                  </td>
                  <td className="px-5 py-4 text-ink-soft">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="px-5 py-4 font-medium tabular-nums text-ink">
                    {formatCurrency(inv.amountCents, inv.currency)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    {inv.status === "open" || inv.status === "draft" ? (
                      <PayButton invoiceId={inv.id} demo={session.demo} />
                    ) : inv.hostedUrl ? (
                      <a
                        href={inv.hostedUrl}
                        className="text-sm font-medium text-forest hover:underline"
                      >
                        Receipt
                      </a>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {session.demo && (
        <p className="text-xs text-ink-faint">
          Demo mode — “Pay now” is inactive until PayPal credentials are added.
        </p>
      )}
    </div>
  );
}
