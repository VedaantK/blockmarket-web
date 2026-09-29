import { describe, expect, it } from "vitest";
import { expectedRemaining, nextTickAt, paceDelta, timeLeft } from "./pace";
import { PACE_START, SEMESTER_END } from "./semester";

describe("expectedRemaining", () => {
  it("is the full plan before the semester starts", () => {
    expect(expectedRemaining(292, PACE_START - 86_400_000)).toBe(292);
    expect(expectedRemaining(292, PACE_START)).toBe(292);
  });

  it("is about half at the midpoint", () => {
    const mid = (PACE_START + SEMESTER_END) / 2;
    expect(expectedRemaining(252, mid)).toBe(126);
  });

  it("is 0 at and after the end", () => {
    expect(expectedRemaining(205, SEMESTER_END)).toBe(0);
    expect(expectedRemaining(205, SEMESTER_END + 1)).toBe(0);
  });
});

describe("nextTickAt", () => {
  it("lands exactly where the count drops", () => {
    const now = Date.parse("2026-10-01T12:00:00-04:00");
    const before = expectedRemaining(292, now);
    const tick = nextTickAt(292, now)!;
    expect(tick).toBeGreaterThan(now);
    expect(expectedRemaining(292, tick - 1)).toBe(before);
    expect(expectedRemaining(292, tick)).toBe(before - 1);
  });

  it("is null once the semester is over", () => {
    expect(nextTickAt(292, SEMESTER_END)).toBeNull();
  });
});

describe("timeLeft", () => {
  it("counts down to the end and clamps at zero", () => {
    expect(timeLeft(SEMESTER_END - 90_061_000)).toEqual({ days: 1, hours: 1, minutes: 1, seconds: 1 });
    expect(timeLeft(SEMESTER_END + 5000)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});

describe("paceDelta", () => {
  const mid = (PACE_START + SEMESTER_END) / 2;

  it("is positive when you have extra blocks", () => {
    expect(paceDelta(150, 292, mid)).toBe(4);
  });

  it("is negative when you're behind", () => {
    expect(paceDelta(100, 292, mid)).toBe(-46);
  });

  it("is zero on pace", () => {
    expect(paceDelta(146, 292, mid)).toBe(0);
  });
});
