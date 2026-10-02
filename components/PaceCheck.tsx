"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { paceDelta } from "@/lib/pace";
import type { Plan } from "@/lib/semester";

function blocks(n: number) {
  return `${n} ${n === 1 ? "block" : "blocks"}`;
}

/** "How many do you have?" input that compares your count with the on-pace number. */
export function PaceCheck({ plan, now }: { plan: Plan; now: number | null }) {
  const reduce = useReducedMotion();
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [raw, setRaw] = useState("");

  const have = raw === "" ? null : Number(raw);
  const invalid = have !== null && (!Number.isInteger(have) || have < 0 || have > plan.blocks);
  const delta = have === null || invalid || now === null ? null : paceDelta(have, plan.blocks, now);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="self-start text-sm font-semibold text-[var(--plan)] underline decoration-2 underline-offset-4 hover:decoration-[3px]"
      >
        Check yours →
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3 border-t-2 border-dashed border-ink/15 pt-4">
      <label htmlFor={inputId} className="text-sm font-semibold">
        How many do you have left?
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={0}
        max={plan.blocks}
        autoFocus
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={`0–${plan.blocks}`}
        aria-invalid={invalid}
        aria-describedby={`${inputId}-result`}
        className="pace-input"
      />
      <div id={`${inputId}-result`} aria-live="polite" className="min-h-[2.75rem] text-sm">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={invalid ? "invalid" : delta === null ? "empty" : Math.sign(delta)}
            initial={reduce ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
          >
            {invalid ? (
              <span className="text-[var(--red)]">Enter a number from 0 to {plan.blocks}.</span>
            ) : delta === null ? (
              <span className="text-muted">We&rsquo;ll compare it with where you should be.</span>
            ) : delta > 0 ? (
              <>
                You&rsquo;re <strong>{blocks(delta)} ahead</strong> of pace.{" "}
                <Link href="/sell" className="font-semibold text-[var(--plan)] underline underline-offset-4">
                  Sell the extras →
                </Link>
              </>
            ) : delta < 0 ? (
              <>
                You&rsquo;re <strong>{blocks(-delta)} behind</strong>. Pace yourself, or order through Block Market for
                less.
              </>
            ) : (
              <>Right on pace. Nice.</>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
