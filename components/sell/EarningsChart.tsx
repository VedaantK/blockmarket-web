"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/menu";
import { dayStart, type Payout } from "@/lib/sell";

/** Last 7 days of earnings as bars, today on the right. */
export function EarningsChart({ payouts, now }: { payouts: Payout[]; now: number }) {
  const [hover, setHover] = useState<number | null>(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const start = dayStart(now, 6 - i);
    const end = start + 86_400_000;
    const inDay = payouts.filter((p) => p.at >= start && p.at < end);
    return {
      label: i === 6 ? "Today" : new Date(start).toLocaleDateString("en-US", { weekday: "short" }),
      total: inDay.reduce((n, p) => n + p.amount, 0),
      count: inDay.length,
    };
  });
  const max = Math.max(...days.map((d) => d.total), 1);
  const week = days.reduce((n, d) => n + d.total, 0);
  const shown = hover ?? 6;

  return (
    <section className="card shrink-0 p-5" aria-labelledby="earnings">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 id="earnings" className="font-display text-xl font-bold tracking-tight">
            Earnings, last 7 days
          </h2>
          <p className="mt-0.5 text-sm text-muted">{formatPrice(week)} total</p>
        </div>
        <p className="text-right text-sm" aria-live="polite">
          <span className="block font-semibold">{days[shown].label}</span>
          <span className="text-muted tabular-nums">
            {formatPrice(days[shown].total)} · {days[shown].count} {days[shown].count === 1 ? "order" : "orders"}
          </span>
        </p>
      </div>

      <div className="mt-4 flex h-28 items-end gap-2 border-b-2 border-ink" aria-hidden onMouseLeave={() => setHover(null)}>
        {days.map((d, i) => (
          <div
            key={d.label}
            className="flex h-full flex-1 cursor-default items-end"
            onMouseEnter={() => setHover(i)}
          >
            <div
              className={`w-full rounded-t-[4px] border-2 border-b-0 border-ink transition-[height,background-color] duration-500 motion-reduce:transition-none ${
                hover === i || (hover === null && i === 6) ? "bg-[var(--green)]" : "bg-[color-mix(in_srgb,var(--green)_45%,var(--surface))]"
              }`}
              style={{ height: d.total ? `${Math.max(6, (d.total / max) * 100)}%` : "0%" }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-xs text-muted" aria-hidden>
        {days.map((d, i) => (
          <span key={d.label} className={`flex-1 text-center ${i === shown ? "font-semibold text-ink" : ""}`}>
            {i === 6 ? "Today" : d.label.slice(0, 2)}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Earnings per day, last 7 days</caption>
        <tbody>
          {days.map((d) => (
            <tr key={d.label}>
              <th scope="row">{d.label}</th>
              <td>{formatPrice(d.total)}</td>
              <td>{d.count} orders</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
