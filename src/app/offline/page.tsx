import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/logo";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-md text-center">
        <div className="flex justify-center">
          <Logo showTagline />
        </div>
        <h1 className="mt-10 font-serif text-3xl tracking-tight text-ink">
          You&apos;re offline
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          It looks like you&apos;ve lost your connection. Pages you&apos;ve
          already visited are still available — reconnect to see the rest.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-full bg-forest px-6 text-sm font-medium text-paper transition-colors hover:bg-forest-deep"
        >
          Try the homepage
        </Link>
      </div>
    </main>
  );
}
