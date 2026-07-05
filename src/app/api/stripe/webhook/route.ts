import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Stripe webhook. Marks invoices paid when their Checkout session completes.
 * Configure the endpoint in the Stripe dashboard and set STRIPE_WEBHOOK_SECRET.
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkout = event.data.object as Stripe.Checkout.Session;
    const invoiceId = checkout.metadata?.invoiceId;
    if (invoiceId) {
      const supabase = await createSupabaseServerClient();
      await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", invoiceId);
    }
  }

  return NextResponse.json({ received: true });
}
