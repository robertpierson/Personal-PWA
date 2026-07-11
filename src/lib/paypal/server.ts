import "server-only";

/**
 * Minimal PayPal Orders v2 REST client (plain fetch, no SDK dependency).
 * Sandbox vs live controlled by PAYPAL_ENV (defaults to sandbox).
 */

const BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const id = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${await res.text()}`);
  const data = await res.json();
  return data.access_token as string;
}

async function paypalFetch(path: string, init: RequestInit) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PayPal API ${res.status}: ${await res.text()}`);
  return res.json();
}

/** Creates an order for one invoice; returns the approve link to redirect to. */
export async function createOrder(invoice: {
  id: string;
  number: string;
  description: string | null;
  amountCents: number;
  currency: string;
}): Promise<{ approveUrl: string }> {
  const order = await paypalFetch("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          custom_id: invoice.id,
          description: `Invoice ${invoice.number}${invoice.description ? ` — ${invoice.description}` : ""}`,
          amount: {
            currency_code: invoice.currency.toUpperCase(),
            value: (invoice.amountCents / 100).toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/paypal/capture-order`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/invoices`,
        user_action: "PAY_NOW",
      },
    }),
  });

  const approveUrl = order.links.find((l: { rel: string }) => l.rel === "approve")?.href;
  if (!approveUrl) throw new Error("PayPal order missing approve link.");
  return { approveUrl };
}

/** Captures a buyer-approved order; returns the invoice id (custom_id) it paid. */
export async function captureOrder(orderId: string): Promise<{ invoiceId: string | null }> {
  const result = await paypalFetch(`/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
  });
  const invoiceId = result.purchase_units?.[0]?.custom_id ?? null;
  return { invoiceId };
}

/** Verifies a webhook came from PayPal. */
export async function verifyWebhookSignature(
  headers: Headers,
  body: string,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return false;
  const result = await paypalFetch("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: webhookId,
      webhook_event: JSON.parse(body),
    }),
  });
  return result.verification_status === "SUCCESS";
}
