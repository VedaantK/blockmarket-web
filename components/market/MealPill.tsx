const PERIODS = [
  { until: 5, label: "Late night" },
  { until: 11, label: "Breakfast time" },
  { until: 16, label: "Lunch time" },
  { until: 21, label: "Dinner time" },
  { until: 24, label: "Late night" },
];

/** Little "Lunch time · Pickup on campus" pill based on the hour in Pittsburgh. */
export function MealPill({ hour }: { hour: number | null }) {
  const period = hour === null ? null : PERIODS.find((p) => hour < p.until);
  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-sm font-medium">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--green)] opacity-60 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-[var(--green)]" />
      </span>
      {period ? `${period.label} · Pickup on campus` : "Pickup on campus"}
    </p>
  );
}
