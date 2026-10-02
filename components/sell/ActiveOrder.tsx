"use client";

import { motion, useReducedMotion } from "motion/react";
import { findItem, formatPrice } from "@/lib/menu";
import { PLACE_WINDOW, type IncomingOrder } from "@/lib/sell";
import { findVendor } from "@/lib/vendors";

export type Active = {
  order: IncomingOrder;
  acceptedAt: number;
  stage: "place" | "pickup";
};

function clock(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const STEPS = ["Accepted", "Placed", "Picked up"];

export function ActiveOrder({
  active,
  now,
  onPlaced,
  onRelease,
}: {
  active: Active;
  now: number;
  onPlaced: () => void;
  onRelease: () => void;
}) {
  const reduce = useReducedMotion();
  const { order, stage } = active;
  const vendor = findVendor(order.cart.vendorId!)!;
  const left = active.acceptedAt + PLACE_WINDOW - now;
  // Steps finished so far: "Accepted" right away, "Placed" once they tap the button.
  const done = stage === "place" ? 1 : 2;

  return (
    <motion.section
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, rotate: 1 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="card overflow-hidden"
      aria-labelledby="active-order"
      style={{ boxShadow: "5px 5px 0 var(--green)" }}
    >
      <div className="flex items-center justify-between gap-3 border-b-2 border-ink bg-[color-mix(in_srgb,var(--green)_14%,var(--surface))] px-5 py-3">
        <h2 id="active-order" className="font-display text-xl font-bold tracking-tight">
          Your order
        </h2>
        <span className="font-mono text-sm font-semibold">#{order.id}</span>
      </div>

      {/* Two columns on desktop so the card stays short and the bank below keeps its room. */}
      <div className="grid gap-5 p-5 lg:grid-cols-2 lg:gap-6">
        <div className="flex flex-col gap-4">
          <ol className="flex items-center gap-2 text-xs font-semibold" aria-label="Progress">
            {STEPS.map((s, i) => (
              <li key={s} className="flex flex-1 items-center gap-2">
                <span
                  className={`grid size-6 shrink-0 place-items-center rounded-md border-2 border-ink ${
                    i < done ? "bg-[var(--green)] text-on-color" : "bg-surface text-muted"
                  }`}
                  aria-hidden
                >
                  {i < done ? "✓" : i + 1}
                </span>
                <span className={`whitespace-nowrap ${i < done ? "" : "text-muted"}`}>{s}</span>
                {i < STEPS.length - 1 && <span aria-hidden className="h-0.5 flex-1 bg-ink/15" />}
              </li>
            ))}
          </ol>

          <div>
            <p className="font-display text-2xl font-bold tracking-tight">{vendor.name}</p>
            <ul className="mt-2 flex flex-col gap-1">
              {order.cart.lines.map((l) => (
                <li key={l.itemId} className="flex items-center gap-2">
                  <span aria-hidden className="size-2 rounded-[2px] bg-ink" />
                  {l.qty}× {findItem(vendor.id, l.itemId)?.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {stage === "place" ? (
          <div className="flex flex-col gap-3">
            <p className="rounded-xl border-2 border-dashed border-ink/20 px-4 py-3 text-sm">
              Order this at the {vendor.name} counter with one of your blocks. Put it under the name{" "}
              <strong className="font-mono">BM-{order.id}</strong> so the buyer can find it.
            </p>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted">
                Place within{" "}
                <span className={`font-mono font-bold tabular-nums ${left < 60_000 ? "text-[var(--red)]" : "text-ink"}`}>
                  {clock(left)}
                </span>
              </p>
              <p className="text-sm">
                You earn <strong className="text-[var(--green)]">{formatPrice(order.payout)}</strong>
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row-reverse">
              <button type="button" onClick={onPlaced} className="btn btn-primary btn-sm flex-1 justify-center">
                I&rsquo;ve placed it
              </button>
              <button type="button" onClick={onRelease} className="btn btn-sm justify-center bg-surface">
                Release
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 self-start rounded-xl bg-ink/5 px-4 py-3">
            <span className="relative flex size-3 shrink-0">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--blue)] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-3 rounded-full bg-[var(--blue)]" />
            </span>
            <p className="text-sm">
              Waiting for the buyer to pick it up. <strong>{formatPrice(order.payout)}</strong> lands in your balance as soon as
              they do.
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
}
