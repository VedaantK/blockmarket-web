"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cartTotals, useCart, type Cart } from "@/lib/cart";
import { findItem, formatPrice } from "@/lib/menu";
import { saveOrder } from "@/lib/orders";
import { useNow } from "@/lib/useNow";
import { findVendor, formatHour, isOpen, type Vendor } from "@/lib/vendors";
import { CartPanel } from "./CartPanel";

const PAYMENT = [
  { id: "apple", label: "Apple Pay" },
  { id: "card", label: "Debit or credit card" },
  { id: "venmo", label: "Venmo" },
];

// Demo timings for the tracker until orders come from a real backend.
const STEPS = [
  { label: "Order sent", detail: "Waiting for a student with spare blocks.", at: 0 },
  { label: "Claimed", detail: "A verified CMU student is paying with their block.", at: 4_000 },
  { label: "Being made", detail: "The kitchen has your order.", at: 9_000 },
  { label: "Ready for pickup", detail: "Show your code at the counter.", at: 16_000 },
];

type PlacedOrder = { cart: Cart; total: number; code: string; placedAt: number; pickup: string };

function Choice({
  name,
  value,
  checked,
  onChange,
  title,
  detail,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  title: string;
  detail?: string;
}) {
  return (
    <label className="choice">
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" />
      <span aria-hidden className="choice-dot" />
      <span>
        <span className="block font-semibold">{title}</span>
        {detail && <span className="block text-sm text-muted">{detail}</span>}
      </span>
    </label>
  );
}

/** Next few 15-minute pickup slots inside the vendor's hours. */
function pickupSlots(vendor: Vendor, now: number) {
  const slots: string[] = [];
  const step = 15 * 60_000;
  let t = Math.ceil((now + vendor.readyMins[1] * 60_000) / step) * step;
  for (let i = 0; i < 24 && slots.length < 8; i++, t += step) {
    if (isOpen(vendor, t)) {
      slots.push(new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/New_York" }));
    }
  }
  return slots;
}

function Tracker({ order }: { order: PlacedOrder }) {
  const reduce = useReducedMotion();
  const now = useNow();
  const vendor = findVendor(order.cart.vendorId!)!;
  const elapsed = now === null ? 0 : now - order.placedAt;
  const step = STEPS.reduce((n, s, i) => (elapsed >= s.at ? i : n), 0);
  const ready = step === STEPS.length - 1;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pt-10 pb-24 sm:px-8 sm:pt-14">
      <p className="text-muted">Order from {vendor.name}</p>
      <h1 className="mt-1 font-display text-[clamp(2.25rem,5.5vw,3.5rem)] font-bold leading-[1.02] tracking-tight" aria-live="polite">
        {ready ? "Your food is ready." : "Order placed. Hang tight."}
      </h1>

      <div className="card mt-8 flex flex-col items-center gap-2 p-8 text-center">
        <p className="text-sm font-semibold text-muted">Pickup code</p>
        <p className="font-display text-7xl font-bold tracking-[0.15em] text-[var(--green)] tabular-nums">{order.code}</p>
        <p className="text-sm text-muted">
          {order.pickup === "asap" ? `Usually ready in ${vendor.readyMins[0]}–${vendor.readyMins[1]} min` : `Scheduled for ${order.pickup}`}
        </p>
      </div>

      <ol className="mt-10 flex flex-col">
        {STEPS.map((s, i) => {
          const done = i <= step;
          return (
            <li key={s.label} className="relative flex gap-4 pb-8 last:pb-0">
              {i < STEPS.length - 1 && (
                <span aria-hidden className="absolute top-9 bottom-1 left-[17px] w-0.5 bg-ink/15">
                  <motion.span
                    className="block w-full origin-top bg-ink"
                    initial={false}
                    animate={{ scaleY: i < step ? 1 : 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.5 }}
                    style={{ height: "100%" }}
                  />
                </span>
              )}
              <motion.span
                aria-hidden
                initial={false}
                animate={{ scale: i === step && !reduce ? [1, 1.15, 1] : 1 }}
                transition={{ duration: 0.4 }}
                className={`grid size-9 shrink-0 place-items-center rounded-lg border-2 border-ink font-bold transition-colors ${
                  done ? "bg-[var(--green)] text-on-color" : "bg-surface text-muted"
                }`}
              >
                {done ? "✓" : i + 1}
              </motion.span>
              <div className="pt-1">
                <p className={`font-semibold ${done ? "" : "text-muted"}`}>{s.label}</p>
                <p className="text-sm text-muted">{s.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-12 rounded-2xl border-2 border-ink/15 p-6">
        <h2 className="font-display text-xl font-bold">Receipt</h2>
        <ul className="mt-3 flex flex-col gap-1 text-sm">
          {order.cart.lines.map((l) => (
            <li key={`${l.itemId}-${l.note}`} className="flex justify-between gap-4">
              <span>
                {l.qty}× {findItem(vendor.id, l.itemId)?.name}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t-2 border-ink/10 pt-3 font-bold">
          <span>Paid</span>
          <span className="tabular-nums">{formatPrice(order.total)}</span>
        </p>
      </div>

      <Link href="/market" className="btn btn-primary mt-10">
        Order something else
        <span aria-hidden className="btn-arrow">
          →
        </span>
      </Link>
    </div>
  );
}

export function Checkout() {
  const { cart, clear } = useCart();
  const now = useNow();
  const [pickup, setPickup] = useState("asap");
  const [payment, setPayment] = useState("apple");
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  const vendor = cart.vendorId ? findVendor(cart.vendorId) : undefined;
  const closed = vendor && now !== null && !isOpen(vendor, now);
  const slots = vendor && now !== null ? pickupSlots(vendor, now) : [];

  useEffect(() => {
    if (order) window.scrollTo({ top: 0 });
  }, [order]);

  if (order) return <Tracker order={order} />;

  if (!vendor || cart.lines.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-4 px-4 pt-14 pb-24 sm:px-8">
        <h1 className="font-display text-[clamp(2.25rem,5.5vw,3.5rem)] font-bold tracking-tight">Your cart is empty</h1>
        <p className="text-lg text-muted">Pick a spot and add something tasty.</p>
        <Link href="/market" className="btn btn-primary mt-4">
          Browse spots
          <span aria-hidden className="btn-arrow">
            →
          </span>
        </Link>
      </div>
    );
  }

  const place = () => {
    const placed = {
      cart,
      total: cartTotals(cart).total,
      code: String(Math.floor(1000 + Math.random() * 9000)),
      placedAt: now ?? Date.now(),
      pickup,
    };
    setOrder(placed);
    saveOrder({ id: `${placed.placedAt}-${placed.code}`, cart, total: placed.total, placedAt: placed.placedAt });
    clear();
  };

  const canPlace = !closed || pickup !== "asap";

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-6 pb-24 sm:px-8">
      <Link href={`/market/${vendor.id}`} className="inline-flex items-center gap-2 font-semibold text-muted hover:text-ink">
        <span aria-hidden>←</span> Back to {vendor.name}
      </Link>
      <h1 className="mt-4 font-display text-[clamp(2.25rem,5.5vw,3.5rem)] font-bold tracking-tight">Checkout</h1>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-6">
          <section className="card p-6">
            <h2 className="font-display text-2xl font-bold tracking-tight">Pickup</h2>
            <p className="mt-1 text-muted">At the {vendor.name} counter. No meetups.</p>
            <fieldset className="mt-5 grid gap-3 sm:grid-cols-2">
              <legend className="sr-only">Pickup time</legend>
              <Choice
                name="pickup"
                value="asap"
                checked={pickup === "asap"}
                onChange={setPickup}
                title="As soon as possible"
                detail={closed ? `Closed until ${formatHour(vendor.hours.open)}` : `${vendor.readyMins[0]}–${vendor.readyMins[1]} min`}
              />
              <Choice
                name="pickup"
                value={slots[0] ?? "later"}
                checked={pickup !== "asap"}
                onChange={setPickup}
                title="Schedule for later"
                detail={pickup !== "asap" ? pickup : "Pick a time"}
              />
            </fieldset>
            {pickup !== "asap" && (
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Pickup times">
                {slots.length ? (
                  slots.map((s) => (
                    <button key={s} type="button" className="chip" aria-pressed={pickup === s} onClick={() => setPickup(s)}>
                      {s}
                    </button>
                  ))
                ) : (
                  <p className="text-sm text-muted">No times left today.</p>
                )}
              </div>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display text-2xl font-bold tracking-tight">Payment</h2>
            <fieldset className="mt-5 grid gap-3">
              <legend className="sr-only">Payment method</legend>
              {PAYMENT.map((p) => (
                <Choice key={p.id} name="payment" value={p.id} checked={payment === p.id} onChange={setPayment} title={p.label} />
              ))}
            </fieldset>
          </section>
        </div>

        <aside className="card flex flex-col gap-5 p-6 lg:sticky lg:top-24">
          <CartPanel checkout />
          <button
            type="button"
            onClick={place}
            disabled={!canPlace || (pickup !== "asap" && !slots.includes(pickup))}
            className="btn btn-primary justify-center disabled:pointer-events-none disabled:opacity-40"
          >
            Place order · {formatPrice(cartTotals(cart).total)}
          </button>
          <p className="flex items-center gap-2 text-sm text-muted">
            <svg aria-hidden viewBox="0 0 20 20" className="size-4 shrink-0 text-[var(--green)]" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10 2 3.5 4.5v5c0 4 2.8 7 6.5 8.5 3.7-1.5 6.5-4.5 6.5-8.5v-5z" strokeLinejoin="round" />
              <path d="m7 10 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Paid by a verified CMU student. Full refund if nobody claims it.
          </p>
        </aside>
      </div>
    </div>
  );
}
