"use client";

import { useNow } from "@/lib/useNow";
import { PLANS } from "@/lib/semester";
import { Button } from "./Button";
import { PlanCard } from "./PlanCard";
import { SemesterCountdown } from "./SemesterCountdown";

const TILTS = [-1.5, 1, -1];

export function Hero() {
  const now = useNow();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 pb-20 sm:px-8">
      <header className="flex items-center gap-2.5">
        <span className="grid grid-cols-2 gap-[3px]" aria-hidden>
          <span className="size-2.5 rounded-[3px] bg-[var(--green)]" />
          <span className="size-2.5 rounded-[3px] bg-[var(--blue)]" />
          <span className="size-2.5 rounded-[3px] bg-[var(--red)]" />
          <span className="size-2.5 rounded-[3px] bg-ink" />
        </span>
        <span className="font-display text-xl font-bold tracking-tight">Block Market</span>
      </header>

      <p className="mt-14 inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-sm font-medium sm:mt-20">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--green)] opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-[var(--green)]" />
        </span>
        Live pace for CMU Fall 2026
      </p>

      <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.02] tracking-tight">
        If you&rsquo;re on one of these plans, you should have&hellip;
      </h1>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} now={now} tilt={TILTS[i]} />
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
          <p className="mt-1 text-muted">Extra blocks go to waste at the end of the semester. Sell them instead.</p>
        </div>
        <Button href="#" variant="secondary">
          Sell here
        </Button>
      </div>
    </section>
  );
}
