"use client";

import { useActionState, useEffect, useState } from "react";
import { updateOrgSettings, type OrgSettingsState } from "@/app/(app)/dashboard/actions";
import { orgTypes } from "@/lib/site";

const fieldClass =
  "w-full rounded-xl border border-line-strong bg-panel px-4 py-2.5 text-ink placeholder:text-ink-faint transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20";
const labelClass = "mb-1.5 block text-sm font-medium text-ink";

export function OrgSettingsForm({
  name,
  type,
  ownerEmail,
}: {
  name: string;
  type: string;
  ownerEmail: string;
}) {
  const [state, formAction, pending] = useActionState<
    OrgSettingsState,
    FormData
  >(updateOrgSettings, {});
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!state.saved) return;
    const frame = requestAnimationFrame(() => setSavedFlash(true));
    const t = setTimeout(() => setSavedFlash(false), 3000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(t);
    };
  }, [state]);

  return (
    <form action={formAction} className="divide-y divide-line">
      <div className="grid gap-5 p-5 sm:grid-cols-2">
        <div>
          <label htmlFor="org-name" className={labelClass}>
            Organization name
          </label>
          <input
            id="org-name"
            name="name"
            required
            defaultValue={name}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="org-type" className={labelClass}>
            Type
          </label>
          <select
            id="org-type"
            name="type"
            defaultValue={type}
            className={fieldClass}
          >
            {/* Keep the org's current value selectable even if it predates this list. */}
            {!orgTypes.includes(type as (typeof orgTypes)[number]) && (
              <option value={type}>{type}</option>
            )}
            {orgTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between px-5 py-4">
        <span className="text-ink-soft">Account owner</span>
        <span className="font-medium text-ink">{ownerEmail}</span>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-5">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 items-center rounded-full bg-forest px-5 text-sm font-medium text-paper transition-colors duration-200 hover:bg-forest-deep focus:outline-none focus:ring-2 focus:ring-forest/20 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {savedFlash && (
          <p className="text-sm font-medium text-forest">Saved.</p>
        )}
        {state.error && (
          <p className="text-sm text-red-400">{state.error}</p>
        )}
      </div>
    </form>
  );
}
