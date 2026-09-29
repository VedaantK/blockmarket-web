"use client";

import { useNow } from "@/lib/useNow";
import { PLANS } from "@/lib/semester";
import { Button } from "./Button";
import { PlanCard } from "./PlanCard";
import { SemesterCountdown } from "./SemesterCountdown";

const TILTS = [-1.5, 1, -1];

export function HeroV2() {
  const now = useNow();

  return (
    <section id="hero" className="mx-auto w-full max-w-6xl px-4 pt-10 pb-20 sm:px-8 sm:pt-16">
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-sm font-medium">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--green)] opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--green)]" />
          </span>
          Live at CMU · Fall 2026
        </p>
        <p className="mt-5 font-display text-[clamp(1.25rem,2.4vw,1.6rem)] font-bold leading-snug tracking-tight">
          The CMU marketplace for spare meal blocks.
        </p>
        <p className="mt-1 text-lg text-muted">Eat for less than menu price, or get paid for blocks you won&rsquo;t use.</p>
      </div>

      <h1 className="mt-12 max-w-3xl font-display text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.02] tracking-tight">
        If you&rsquo;re on one of these plans, you should have&hellip;
      </h1>

      <div className="mt-10 grid items-start gap-5 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} now={now} tilt={TILTS[i]} paceCheck />
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">
        …blocks left to finish at exactly zero. Assumes steady use from the first day of classes (Aug 24) to the
        last day of finals (Dec 14). Plan sizes from CMU Dining&rsquo;s 2026–27 dining plans.
      </p>

      <div className="mt-16 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-5">
          <h2 className="max-w-xl font-display text-[clamp(1.6rem,3.2vw,2.4rem)] font-bold leading-tight tracking-tight">
            &hellip;and there&rsquo;s only this long left in the semester.
          </h2>
          <SemesterCountdown now={now} />
        </div>
        <Button href="#">Track your meal blocks here</Button>
      </div>

      <div className="mt-16 flex flex-col items-start gap-5 rounded-3xl border border-ink/15 bg-ink/[0.03] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">Running behind?</h2>
          <p className="mt-1 text-muted">
            Blocks you don&rsquo;t use disappear at the end of the semester. Sell them and get paid instead.
          </p>
        </div>
        <Button href="#" variant="secondary">
          Sell here
        </Button>
      </div>

      <p className="mt-5 flex items-center gap-2 text-sm text-muted">
        <svg aria-hidden viewBox="0 0 20 20" className="size-4 text-[var(--green)]" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M10 2 3.5 4.5v5c0 4 2.8 7 6.5 8.5 3.7-1.5 6.5-4.5 6.5-8.5v-5z" strokeLinejoin="round" />
          <path d="m7 10 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Every seller is a verified CMU student.
      </p>
    </section>
  );
}
