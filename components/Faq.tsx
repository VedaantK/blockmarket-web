"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";

// Filler copy until the real FAQ is written.
const FAQS = [
  {
    q: "How does Block Market work?",
    a: "You place an order from a campus spot. A verified student with spare meal blocks claims it and pays with their block. You pick up your food with a code, and they get paid.",
  },
  {
    q: "How do sellers get paid?",
    a: "Once the buyer picks up their order, the payment is released to the seller. Payout details will go here.",
  },
  {
    q: "Which dining spots can I order from?",
    a: "Any spot listed in “Places you can eat from” above. We’re adding more over the semester.",
  },
];

function Item({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const id = useId();

  return (
    <div className="border-b-2 border-ink/15 last:border-b-0">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((o) => !o)}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">{q}</span>
          <span
            aria-hidden
            className={`grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink transition-[transform,background-color] duration-300 motion-reduce:transition-none ${
              open ? "rotate-180 bg-ink text-paper" : "group-hover:bg-ink/5"
            }`}
          >
            <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m5 8 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-2xl pb-6 text-lg text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto w-full max-w-6xl px-4 pt-10 pb-28 sm:px-8">
      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tight">FAQ</h2>
          <p className="mt-2 text-muted">The quick answers.</p>
        </div>
        <div className="card px-6 sm:px-8">
          {FAQS.map((f) => (
            <Item key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
