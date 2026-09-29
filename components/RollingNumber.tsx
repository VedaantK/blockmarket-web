"use client";

import { motion, useReducedMotion } from "motion/react";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function Digit({ value }: { value: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <motion.span
        className="absolute inset-x-0 top-0 flex flex-col"
        initial={false}
        animate={{ y: `${-value}em` }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 22 }}
      >
        {DIGITS.map((d) => (
          <span key={d} className="block h-[1em] text-center leading-none">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** Odometer-style number: each digit rolls to its new value. */
export function RollingNumber({ value, minDigits = 1 }: { value: number; minDigits?: number }) {
  const text = String(value).padStart(minDigits, "0");
  return (
    <span className="inline-flex leading-none tabular-nums">
      <span className="sr-only">{value}</span>
      {/* Key digits from the right so the ones column stays the ones column. */}
      <span aria-hidden className="inline-flex">
        {text.split("").map((d, i) => (
          <Digit key={text.length - i} value={Number(d)} />
        ))}
      </span>
    </span>
  );
}
