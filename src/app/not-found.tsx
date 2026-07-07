import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { cta } from "@/content/site.config";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center">
      <Logo />
      <p className="eyebrow mt-10">404</p>
      <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        That page moved, or never existed.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Either way, you didn&apos;t do anything wrong. Head back to the
        homepage, or book an intro call if you were trying to reach us.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/" variant="secondary" size="lg">
          Back to homepage
        </ButtonLink>
        <ButtonLink href="/contact" size="lg">
          {cta.primary}
        </ButtonLink>
      </div>
    </div>
  );
}
