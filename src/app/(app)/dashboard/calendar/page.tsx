import type { Metadata } from "next";
import { requireSession } from "@/lib/auth";
import { getCalendar } from "@/lib/data/dashboard";
import { PageHeader } from "@/components/dashboard/primitives";
import { CalendarView } from "@/components/dashboard/calendar-view";

export const metadata: Metadata = { title: "Content calendar" };

export default async function CalendarPage() {
  const session = await requireSession();
  const items = await getCalendar(session);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Content calendar"
        description="Everything planned across your channels. Nothing publishes without your review."
      />
      <CalendarView items={items} />
    </div>
  );
}
