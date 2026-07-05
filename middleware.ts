import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/config";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // In demo mode there's no Supabase session to refresh.
  if (!isSupabaseConfigured) return NextResponse.next();
  return updateSession(request);
}

export const config = {
  // Run on app routes but skip static assets, the service worker, and icons.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icon.*\\.png|icon\\.svg|apple-touch-icon\\.png|offline).*)",
  ],
};
