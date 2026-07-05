import Link from "next/link";
import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-paper paper-grain">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <Logo />
        <Link
          href="/"
          className="text-sm font-medium text-ink-soft hover:text-forest"
        >
          ← Back to site
        </Link>
      </header>
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        {children}
      </div>
    </div>
  );
}
