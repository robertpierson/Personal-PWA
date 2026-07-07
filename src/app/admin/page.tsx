import type { Metadata } from "next";
import Link from "next/link";
import { getOperator } from "@/lib/operator";
import { adminListOrgs } from "@/lib/data/admin";
import { createOrg } from "@/app/admin/actions";
import { PageHeader, Panel } from "@/components/dashboard/primitives";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Operator · Clients" };

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-panel px-4 py-2.5 text-ink placeholder:text-ink-faint focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";

export default async function AdminHome() {
  const op = await getOperator();
  const orgs = await adminListOrgs();
  const readOnly = op?.demo ?? true;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clients"
        description="Every organization you manage. Create a client to provision their owner login and dashboard."
      />

      <Panel title="Organizations">
        <ul className="divide-y divide-line">
          {orgs.length === 0 && (
            <li className="px-5 py-8 text-center text-sm text-ink-faint">
              No clients yet. Create your first below.
            </li>
          )}
          {orgs.map((org) => (
            <li key={org.id}>
              <Link
                href={`/admin/orgs/${org.id}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-paper-2/50"
              >
                <div>
                  <p className="font-medium text-ink">{org.name}</p>
                  <p className="text-xs text-ink-faint">
                    {org.type}
                    {org.ownerEmail ? ` · ${org.ownerEmail}` : ""} ·{" "}
                    {org.memberCount} member{org.memberCount === 1 ? "" : "s"}
                  </p>
                </div>
                <span className="text-sm font-medium text-forest">Manage →</span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="New client">
        {readOnly ? (
          <p className="px-5 py-6 text-sm text-ink-soft">
            Creating clients requires a live Supabase project with a service-role
            key, plus your email in <code>OPERATOR_EMAILS</code>. See{" "}
            <code>SETUP.md</code>.
          </p>
        ) : (
          <form action={createOrg} className="grid gap-4 p-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
                Organization name
              </label>
              <input id="name" name="name" required className={fieldClass} placeholder="Riverside Arts Collective" />
            </div>
            <div>
              <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-ink">
                Type
              </label>
              <input id="type" name="type" className={fieldClass} placeholder="Community nonprofit" defaultValue="Community nonprofit" />
            </div>
            <div>
              <label htmlFor="ownerEmail" className="mb-1.5 block text-sm font-medium text-ink">
                Owner email
              </label>
              <input id="ownerEmail" name="ownerEmail" type="email" required className={fieldClass} placeholder="owner@org.org" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ownerPassword" className="mb-1.5 block text-sm font-medium text-ink">
                Temporary owner password{" "}
                <span className="text-ink-faint">(min 8 chars — share securely)</span>
              </label>
              <input id="ownerPassword" name="ownerPassword" type="text" required minLength={8} className={fieldClass} placeholder="a strong temporary password" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Create client + owner login</Button>
            </div>
          </form>
        )}
      </Panel>
    </div>
  );
}
