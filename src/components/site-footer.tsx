import Link from "next/link";
import { Logo } from "@/components/logo";
import { nav, site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-line bg-paper-2">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Logo showTagline />
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              {site.positioning}
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <p className="eyebrow mb-4">Studio</p>
              <ul className="flex flex-col gap-3 text-sm text-ink-soft">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-forest"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4">Get in touch</p>
              <ul className="flex flex-col gap-3 text-sm text-ink-soft">
                <li>
                  <a
                    href={`mailto:${site.contactEmail}`}
                    className="transition-colors hover:text-forest"
                  >
                    {site.contactEmail}
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="transition-colors hover:text-forest"
                  >
                    Book an intro call
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>
              © {year} {site.name}. A placeholder brand — final identity to be
              confirmed.
            </p>
            <Link href="/privacy" className="hover:text-forest">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-forest">
              Terms
            </Link>
            <Link href="/login" className="hover:text-forest">
              Client login
            </Link>
          </div>
          <p className="max-w-md sm:text-right">
            We never post on your behalf without your review.
          </p>
        </div>
      </div>
    </footer>
  );
}
