"use client";

import { useState } from "react";

type QA = { q: string; a: string };

const faqs: QA[] = [
  {
    q: "Do you buy followers or use bots?",
    a: "Never. No bots, no follow/unfollow automation, no engagement pods. Every follower and every bit of reach is earned through real, consistent content. It's the only approach that survives scrutiny from a grant committee or admissions office — which is exactly who tends to look.",
  },
  {
    q: "Will you post to our account for us?",
    a: "We build the content and a clear calendar, but nothing publishes without a human on your side reviewing it first. We can hand you ready-to-post assets, or schedule with your explicit approval — you always stay in control of your own account.",
  },
  {
    q: "How do the Instagram metrics work?",
    a: "With your permission, we connect to your Instagram Business account through Meta's official Graph API to read insights like reach and engagement — read-only. We report honestly from the date you connect onward; we don't fabricate history or inflate numbers.",
  },
  {
    q: "We're a small nonprofit. Is this overkill?",
    a: "It's the opposite. A polished, consistent presence is often what makes a small organization look established and fundable. That's the whole point — helping good organizations look as serious as the work they already do.",
  },
  {
    q: "What do we actually receive?",
    a: "A branded visual system and templates, a content calendar mapped to your programming, delivered design assets, and a regular insights review. Everything lives in one place you can share with your board.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((item, i) => {
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
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-strong text-forest transition-transform duration-300 ${
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
              className={`grid transition-all duration-300 ease-out ${
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
  );
}
