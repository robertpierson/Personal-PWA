import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isStripeConfigured, isSupabaseConfigured } from "@/lib/config";

/**
 * Creates a Stripe Checkout session to pay an open invoice. Owner-only. In demo
 * mode (or without Stripe configured) it returns a friendly notice instead.
 */
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }
  if (session.member.role !== "owner") {
    return NextResponse.json({ error: "Owners only." }, { status: 403 });
  }

  const stripe = getStripe();
  if (!stripe || !isStripeConfigured || !isSupabaseConfigured) {
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

  const checkout = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: invoice.currency ?? "usd",
          product_data: {
            name: `Invoice ${invoice.number}`,
            description: invoice.description ?? undefined,
          },
          unit_amount: invoice.amount_cents,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/dashboard/invoices?paid=1`,
    cancel_url: `${origin}/dashboard/invoices`,
    metadata: { invoiceId: invoice.id, orgId: invoice.org_id },
  });

  return NextResponse.json({ url: checkout.url });
}
