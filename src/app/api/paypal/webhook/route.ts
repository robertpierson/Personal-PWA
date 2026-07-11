import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/paypal/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * PayPal webhook. Backs up the capture-order redirect (e.g. buyer closes the
 * tab before returning) by marking invoices paid on PAYMENT.CAPTURE.COMPLETED.
 * Configure the endpoint in the PayPal developer dashboard and set
 * PAYPAL_WEBHOOK_ID.
 */
export async function POST(request: Request) {
  const body = await request.text();

  const verified = await verifyWebhookSignature(request.headers, body).catch(
    () => false,
  );
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const event = JSON.parse(body);
  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const invoiceId = event.resource?.custom_id;
    if (invoiceId) {
      const supabase = await createSupabaseServerClient();
      await supabase.from("invoices").update({ status: "paid" }).eq("id", invoiceId);
    }
  }

  return NextResponse.json({ received: true });
}
