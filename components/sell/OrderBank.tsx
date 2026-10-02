"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { findItem, formatPrice } from "@/lib/menu";
import { ORDER_TTL, type IncomingOrder } from "@/lib/sell";
import { findVendor, VENDORS } from "@/lib/vendors";

const ACCENTS = ["var(--green)", "var(--blue)", "var(--red)"];

function ago(ms: number) {
  const s = Math.floor(ms / 1000);
  return s < 30 ? "Just now" : s < 60 ? `${s}s ago` : `${Math.floor(s / 60)}m ago`;
}

function Ticket({ order, now, locked, onAccept }: { order: IncomingOrder; now: number; locked: boolean; onAccept: () => void }) {
  const vendor = findVendor(order.cart.vendorId!)!;
  const accent = ACCENTS[VENDORS.indexOf(vendor) % ACCENTS.length];
  const left = Math.max(0, order.expiresAt - now) / ORDER_TTL;

  return (
    <div className="tile relative overflow-hidden" style={{ "--accent": accent } as React.CSSProperties}>
      <span aria-hidden className="absolute inset-y-0 left-0 w-2 border-r-2 border-ink bg-[var(--accent)]" />
      <div className="flex items-center gap-4 py-4 pr-4 pl-6">
        <span className="relative hidden size-14 shrink-0 overflow-hidden rounded-lg border-2 border-ink sm:block">
          <Image src={vendor.image} alt="" fill sizes="56px" className="object-cover" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-xs font-medium text-muted">
            <span className="font-mono">#{order.id}</span>· {ago(now - order.postedAt)}
          </p>
          <p className="truncate font-display text-lg font-bold tracking-tight">{vendor.name}</p>
          <p className="truncate text-sm text-muted">
            {order.cart.lines.map((l) => findItem(vendor.id, l.itemId)?.name).join(" + ")}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          <p className="text-right leading-none">
            <span className="block text-[11px] font-semibold tracking-wide text-muted uppercase">You earn</span>
            <span className="font-display text-2xl font-bold text-[var(--green)] tabular-nums">{formatPrice(order.payout)}</span>
          </p>
          <button
            type="button"
            onClick={onAccept}
            disabled={locked}
            className="btn btn-primary btn-sm disabled:pointer-events-none disabled:opacity-35"
            aria-label={`Accept order ${order.id} from ${vendor.name} for ${formatPrice(order.payout)}`}
          >
            Accept
          </button>
        </div>
      </div>
      {/* Time left before someone else is likely to grab it. */}
      <div className="h-1.5 border-t-2 border-ink bg-ink/5" aria-hidden>
        <div
          className={`h-full transition-[width] duration-1000 ease-linear ${left < 0.25 ? "bg-[var(--red)]" : "bg-[var(--accent)]"}`}
          style={{ width: `${left * 100}%` }}
        />
      </div>
    </div>
  );
}

/** Animated 3×3 block glyph for the empty bank. */
function Waiting() {
  return (
    <div className="flex h-full min-h-64 flex-col items-center justify-center gap-4 px-6 py-10 text-center">
      <span className="grid grid-cols-3 gap-1.5" aria-hidden>
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="size-5 animate-pulse rounded-[5px] border-2 border-ink motion-reduce:animate-none"
            style={{
              animationDelay: `${(i % 3) * 150 + Math.floor(i / 3) * 150}ms`,
              background: i % 4 === 0 ? "var(--green)" : "var(--surface)",
            }}
          />
        ))}
      </span>
      <p className="font-display text-xl font-bold">Waiting for orders…</p>
      <p className="max-w-xs text-sm text-muted">New orders from buyers drop in here. Grab one before someone else does.</p>
    </div>
  );
}

export function OrderBank({
  orders,
  now,
  locked,
  onAccept,
  pinned,
}: {
  orders: IncomingOrder[];
  now: number | null;
  /** The order you're working on, pinned at the top of the bank. */
  pinned?: React.ReactNode;
  locked: boolean;
  onAccept: (order: IncomingOrder) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <section className="card flex min-h-0 flex-1 flex-col overflow-hidden" aria-labelledby="order-bank">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-ink bg-ink px-5 py-3 text-paper">
        <h2 id="order-bank" className="font-display text-xl font-bold tracking-tight">
          Order bank
        </h2>
        <span className="inline-flex items-center gap-2 text-sm font-semibold" aria-live="polite">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--green)] opacity-75 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-[var(--green)]" />
          </span>
          {orders.length} waiting
        </span>
      </div>

      <div className="bank-floor m-3 min-h-64 flex-1 overflow-y-auto p-3 sm:m-4 sm:p-4 lg:min-h-0">
        {pinned}
        {locked && orders.length > 0 && (
          <p className="my-3 rounded-lg bg-surface px-3 py-2 text-sm font-medium text-muted">
            Finish your current order to accept another.
          </p>
        )}
        {pinned && orders.length === 0 ? null : orders.length === 0 || now === null ? (
          <Waiting />
        ) : (
          <ul className="flex flex-col gap-3">
            <AnimatePresence initial={false} mode="popLayout">
              {orders.map((o) => (
                <motion.li
                  key={o.id}
                  layout={!reduce}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, y: -24, rotate: -1.5, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                >
                  <Ticket order={o} now={now} locked={locked} onAccept={() => onAccept(o)} />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
    </section>
  );
}
