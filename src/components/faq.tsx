"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { cta, faq } from "@/content/site.config";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <div className="divide-y divide-line border-y border-line">
        {faq.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-6 py-6 text-left"
              >
                <span className="font-serif text-xl text-ink sm:text-2xl">
                  {item.q}
                </span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-forest transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`grid transition-all duration-200 ease-out ${
                  isOpen
                    ? "grid-rows-[1fr] opacity-100"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-6 leading-relaxed text-ink-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-ink-soft">Still have questions?</p>
        <ButtonLink href="/contact" size="md" className="pop-btn">
          {cta.primary}
        </ButtonLink>
      </div>
    </div>
  );
}
