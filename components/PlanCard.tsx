"use client";

import { motion, useReducedMotion } from "motion/react";
import { expectedRemaining, nextTickAt, tickInterval } from "@/lib/pace";
import type { Plan } from "@/lib/semester";
import { PaceCheck } from "./PaceCheck";
import { RollingNumber } from "./RollingNumber";

function formatWait(ms: number) {
  const mins = Math.max(1, Math.ceil(ms / 60_000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function PlanCard({
  plan,
  now,
  tilt,
  paceCheck = false,
}: {
  plan: Plan;
  now: number | null;
  tilt: number;
  /** Show the "Check yours" input (V2 only). */
  paceCheck?: boolean;
}) {
  const reduce = useReducedMotion();
  const remaining = now === null ? null : expectedRemaining(plan.blocks, now);
  const next = now === null ? null : nextTickAt(plan.blocks, now);
  const interval = tickInterval(plan.blocks);
  const progress = now === null || next === null ? 0 : 1 - (next - now) / interval;

  return (
    <motion.article
      style={{ "--plan": `var(--${plan.id})` } as React.CSSProperties}
      className="card relative flex flex-col gap-5 p-6"
      whileHover={reduce ? undefined : paceCheck ? { y: -4 } : { y: -6, rotate: tilt }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--plan)] px-3 py-1 text-sm font-semibold text-on-color">
          <span className="size-2 rounded-[2px] bg-on-color/90" />
          {plan.name} plan
        </span>
        <span className="text-sm text-muted">{plan.blocks} blocks</span>
      </div>

      <div className="font-display text-[clamp(4rem,9vw,6.5rem)] font-bold text-[var(--plan)]">
        {remaining === null ? (
          <span className="block h-[1em] w-[1.9em] animate-pulse rounded-lg bg-ink/10" />
        ) : (
          <RollingNumber value={remaining} />
        )}
      </div>

      <div>
        <div className="h-1.5 overflow-hidden rounded-full bg-ink/10">
          <div
            className="h-full rounded-full bg-[var(--plan)] transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          {next === null || now === null
            ? remaining === 0
              ? "Semester's over. Hope you ate well."
              : " "
            : `Next block drops in ${formatWait(next - now)}`}
        </p>
      </div>

      {paceCheck && <PaceCheck plan={plan} now={now} />}
    </motion.article>
  );
}
