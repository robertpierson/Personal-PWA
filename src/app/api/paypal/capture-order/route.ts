import { NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * PayPal redirects the buyer here after approval (?token=ORDER_ID&PayerID=...).
 * `token` IS the order id. Capture it, then mark the matching invoice paid
 * using the order's custom_id (set to the invoice id at creation).
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const orderId = url.searchParams.get("token");

  if (!orderId) {
    return NextResponse.redirect(`${origin}/dashboard/invoices?paypal=missing_token`);
  }

  try {
    const { invoiceId } = await captureOrder(orderId);
    if (invoiceId) {
      const supabase = await createSupabaseServerClient();
      await supabase.from("invoices").update({ status: "paid" }).eq("id", invoiceId);
    }
    return NextResponse.redirect(`${origin}/dashboard/invoices?paid=1`);
  } catch (err) {
    console.error("[paypal capture]", err);
    return NextResponse.redirect(`${origin}/dashboard/invoices?paypal=capture_failed`);
  }
}
