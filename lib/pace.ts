import { PACE_START, SEMESTER_END } from "./semester";

const SPAN = SEMESTER_END - PACE_START;

function fractionLeft(now: number) {
  return Math.min(1, Math.max(0, (SEMESTER_END - now) / SPAN));
}

/** Blocks you should have left to hit exactly 0 at the end of the semester. */
export function expectedRemaining(total: number, now: number) {
  return Math.ceil(total * fractionLeft(now));
}

/** When the on-pace count next drops by one, or null once it reaches 0. */
export function nextTickAt(total: number, now: number) {
  const remaining = expectedRemaining(total, now);
  if (remaining === 0) return null;
  return SEMESTER_END - ((remaining - 1) / total) * SPAN;
}

/** Length of time between two ticks for a plan, in ms. */
export function tickInterval(total: number) {
  return SPAN / total;
}

export function timeLeft(now: number) {
  const ms = Math.max(0, SEMESTER_END - now);
  const s = Math.floor(ms / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

/**
 * How far someone is from pace: positive means they have more blocks than
 * they need (ahead), negative means they're using them too fast (behind).
 */
export function paceDelta(have: number, total: number, now: number) {
  return have - expectedRemaining(total, now);
}
