import { CountUp } from "./CountUp";

const STATS = [
  { lead: "Selling to", value: 900, label: "buyers", color: "var(--green)" },
  { lead: "Powered by", value: 50, label: "verified sellers", color: "var(--blue)" },
  { lead: "Serving", value: 10, label: "campus vendors", color: "var(--red)" },
];

export function StatsStrip() {
  return (
    <section className="border-y border-ink/15">
      <div className="mx-auto grid w-full max-w-6xl sm:grid-cols-3">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col gap-1 border-ink/15 px-4 py-12 not-last:border-b sm:px-8 sm:not-last:border-r sm:not-last:border-b-0"
          >
            <span className="text-sm font-medium text-muted">{s.lead}</span>
            <span className="font-display text-7xl font-bold tracking-tight" style={{ color: s.color }}>
              <CountUp to={s.value} suffix="+" />
            </span>
            <span className="text-lg font-semibold">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
