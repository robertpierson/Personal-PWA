import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getDeliverables } from "@/lib/data/dashboard";
import {
  PageHeader,
  StatusBadge,
  formatDate,
} from "@/components/dashboard/primitives";

export const metadata: Metadata = { title: "Deliverables" };

export default async function DeliverablesPage() {
  const session = await requireSession();
  if (session.member.role !== "owner") redirect("/dashboard");

  const deliverables = await getDeliverables(session);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Deliverables"
        description="Every piece of work we're producing for you, and exactly where it stands."
      />

      <ul className="space-y-3">
        {deliverables.map((d) => (
          <li
            key={d.id}
            className="rounded-[var(--radius-card)] border border-line bg-panel p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-xl text-ink">{d.title}</h2>
                  <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-medium text-ink-faint">
                    {d.type}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {d.description}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={d.status} />
                <p className="mt-2 text-xs text-ink-faint">
                  Due {formatDate(d.dueDate)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
