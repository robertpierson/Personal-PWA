"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ButtonLink } from "@/components/ui/button";
import { nav } from "@/lib/site";
import { cta } from "@/content/site.config";

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-colors duration-200 ${
          scrolled
            ? "border-b border-line bg-paper/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-18 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
          <Logo />

          <nav className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-ink-soft transition-colors hover:text-forest"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="text-sm font-medium text-ink-soft transition-colors hover:text-forest"
            >
              Client login
            </Link>
            <ButtonLink href="/contact" size="md" className="pop-btn">
              {cta.primary}
            </ButtonLink>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="relative z-50 grid h-11 w-11 place-items-center rounded-full border border-line-strong text-ink lg:hidden"
          >
            <span className="sr-only">Menu</span>
            <div className="flex flex-col gap-1.5">
              <span
                className={`h-px w-5 bg-current transition-transform duration-200 ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`h-px w-5 bg-current transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`h-px w-5 bg-current transition-transform duration-200 ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 top-0 z-40 flex flex-col bg-paper px-5 pt-24 pb-10 transition-all duration-200 lg:hidden ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-4 font-serif text-2xl text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <ButtonLink
              href="/contact"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {cta.primary}
            </ButtonLink>
            <ButtonLink
              href="/login"
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Client login
            </ButtonLink>
          </div>
        </div>
      </header>

      {/* Sticky mobile CTA — appears on scroll, stays out of the way otherwise */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 p-3 backdrop-blur-md transition-transform duration-200 lg:hidden ${
          scrolled && !open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <ButtonLink href="/contact" size="lg" className="w-full">
          {cta.primary}
        </ButtonLink>
      </div>
    </>
  );
}
