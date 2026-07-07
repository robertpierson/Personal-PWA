import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getDesigns } from "@/lib/data/dashboard";
import {
  PageHeader,
  StatusBadge,
  formatDate,
} from "@/components/dashboard/primitives";

export const metadata: Metadata = { title: "Designs" };

const accentMap: Record<string, string> = {
  forest: "from-forest to-forest-deep",
  gold: "from-gold to-gold-deep",
  ink: "from-ink to-ink-deep",
};

export default async function DesignsPage() {
  const session = await requireSession();
  if (session.member.role !== "owner") redirect("/dashboard");

  const designs = await getDesigns(session);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Delivered designs"
        description="Your branded assets, ready to download and post whenever you are."
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {designs.map((g) => (
          <article
            key={g.id}
            className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-panel"
          >
            <div
              className={`relative flex aspect-[4/3] items-end bg-gradient-to-br p-4 ${accentMap[g.accent]}`}
            >
              {g.fileUrl ? (
                <Image
                  src={g.fileUrl}
                  alt={g.title}
                  fill
                  className="object-cover"
                  sizes="(max-width:768px) 100vw, 33vw"
                />
              ) : (
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-serif text-5xl text-paper/15">
                  {g.title.charAt(0)}
                </span>
              )}
              <span className="relative z-10 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-medium text-ink">
                {g.type}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{g.title}</p>
                <p className="text-xs text-ink-faint">
                  {formatDate(g.createdAt)}
                </p>
              </div>
              <StatusBadge status={g.status} />
            </div>
            <div className="border-t border-line px-4 py-3">
              {g.fileUrl ? (
                <a
                  href={g.fileUrl}
                  className="text-sm font-medium text-forest hover:underline"
                  download
                >
                  Download asset
                </a>
              ) : (
                <span className="text-sm text-ink-faint">
                  {g.status === "delivered"
                    ? "Preview available on request"
                    : "In progress"}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
