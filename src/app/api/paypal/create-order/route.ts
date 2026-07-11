import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createOrder } from "@/lib/paypal/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isPayPalConfigured, isSupabaseConfigured } from "@/lib/config";

/**
 * Creates a PayPal order to pay an open invoice. Owner-only. In demo mode (or
 * without PayPal configured) it returns a friendly notice instead.
 */
export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.member.role !== "owner") {
    return NextResponse.json({ error: "Owners only." }, { status: 403 });
  }
  if (!isPayPalConfigured || !isSupabaseConfigured) {
    return NextResponse.json(
      { error: "Billing isn't configured yet (demo mode)." },
      { status: 503 },
    );
  }

  const { invoiceId } = (await request.json().catch(() => ({}))) as {
    invoiceId?: string;
  };
  if (!invoiceId) {
    return NextResponse.json({ error: "Missing invoice." }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, number, description, amount_cents, currency, status, org_id")
    .eq("id", invoiceId)
    .eq("org_id", session.org.id)
    .maybeSingle();

  if (!invoice || invoice.status === "paid") {
    return NextResponse.json(
      { error: "Invoice not found or already paid." },
      { status: 404 },
    );
  }

  const { approveUrl } = await createOrder({
    id: invoice.id,
    number: invoice.number,
    description: invoice.description,
    amountCents: invoice.amount_cents,
    currency: invoice.currency ?? "usd",
  });

  return NextResponse.json({ url: approveUrl });
}
