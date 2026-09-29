"use client";

import { timeLeft } from "@/lib/pace";
import { RollingNumber } from "./RollingNumber";

const UNITS = [
  ["days", "days"],
  ["hours", "hrs"],
  ["minutes", "min"],
  ["seconds", "sec"],
] as const;

export function SemesterCountdown({ now }: { now: number | null }) {
  const left = now === null ? null : timeLeft(now);
  return (
    <div className="flex items-start gap-2 sm:gap-3" role="timer" aria-live="off">
      {UNITS.map(([key, label], i) => (
        <div key={key} className="flex items-start gap-2 sm:gap-3">
          {i > 0 && <span className="pt-3 font-display text-2xl text-muted sm:pt-4 sm:text-3xl">:</span>}
          <div className="flex flex-col items-center gap-1.5">
            <div className="tile flex h-16 min-w-16 items-center justify-center px-2.5 font-display text-3xl font-bold sm:h-20 sm:min-w-20 sm:text-4xl">
              {left === null ? "––" : <RollingNumber value={left[key]} minDigits={2} />}
            </div>
            <span className="text-xs font-medium uppercase tracking-wider text-muted">{label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
