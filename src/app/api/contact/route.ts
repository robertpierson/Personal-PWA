import { NextResponse } from "next/server";

/**
 * Intro-call request handler.
 *
 * Phase 1 keeps delivery deliberately simple and dependency-free: it validates
 * the payload, logs it, and best-effort appends it to a local JSONL file for
 * review during development. At deploy time, wire `deliver()` to your real
 * channel (email via Resend, a CRM, or a Supabase table) — that's the only spot
 * that needs to change.
 */

type Payload = {
  name?: string;
  email?: string;
  organization?: string;
  orgType?: string;
  role?: string;
  instagram?: string;
  timeframe?: string;
  goals?: string;
  company?: string; // honeypot
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

async function deliver(record: Record<string, string>) {
  // Always log so submissions are visible in dev/server logs.
  console.info("[intro-request]", JSON.stringify(record));

  // Best-effort local persistence; silently skipped on read-only filesystems
  // (e.g. serverless), which is expected until real delivery is wired up.
  try {
    const { appendFile, mkdir } = await import("node:fs/promises");
    const { join } = await import("node:path");
    const dir = join(process.cwd(), ".data");
    await mkdir(dir, { recursive: true });
    await appendFile(
      join(dir, "intro-requests.jsonl"),
      JSON.stringify(record) + "\n",
      "utf8",
    );
  } catch {
    // ignore — logging above is the source of truth in that environment
  }

  // TODO(deploy): send an email / create a CRM lead here.
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: pretend success so bots don't learn they were caught.
  if (clean(body.company)) {
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const organization = clean(body.organization, 200);

  const errors: string[] = [];
  if (!name) errors.push("name");
  if (!EMAIL_RE.test(email)) errors.push("email");
  if (!organization) errors.push("organization");

  if (errors.length) {
    return NextResponse.json(
      { error: `Please check: ${errors.join(", ")}.` },
      { status: 422 },
    );
  }

  const record: Record<string, string> = {
    name,
    email,
    organization,
    orgType: clean(body.orgType, 120),
    role: clean(body.role, 120),
    instagram: clean(body.instagram, 120),
    timeframe: clean(body.timeframe, 120),
    goals: clean(body.goals, 2000),
    receivedAt: new Date().toISOString(),
  };

  try {
    await deliver(record);
  } catch (err) {
    console.error("[intro-request] delivery failed:", err);
    return NextResponse.json(
      { error: "We couldn't submit that. Please try again or email us." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
