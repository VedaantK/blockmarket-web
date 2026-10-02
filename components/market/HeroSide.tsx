"use client";

// Mockups for the empty space beside the market headline. HeroSideSwitch flips between them;
// delete whichever loses (and the switch) once one is picked.

import Image from "next/image";
import Link from "next/link";
import { animate, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cartTotals, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/menu";
import { usePastOrders, type PastOrder } from "@/lib/orders";
import { findVendor, VENDORS } from "@/lib/vendors";
import { orderSummary, useReorder, whenLabel } from "./OrderAgain";

export type HeroSide = "off" | "reorder" | "savings";

const STORAGE_KEY = "bm-hero-side";
const ACCENTS = ["var(--green)", "var(--blue)", "var(--red)"];

/** Shown until someone has real orders, so the mockups aren't empty. */
function sampleOrders(): PastOrder[] {
  const day = 86_400_000;
  const now = Date.now();
  const orders: Omit<PastOrder, "total">[] = [
    { id: "s1", placedAt: now - 2 * 3_600_000, cart: { vendorId: "hunan", lines: [{ itemId: "orange-chicken", qty: 1, note: "" }, { itemId: "rangoon", qty: 1, note: "" }] } },
    { id: "s2", placedAt: now - day, cart: { vendorId: "k-truck", lines: [{ itemId: "bulgogi", qty: 1, note: "" }] } },
    { id: "s3", placedAt: now - 3 * day, cart: { vendorId: "the-edge", lines: [{ itemId: "pepperoni", qty: 1, note: "" }, { itemId: "soda", qty: 1, note: "" }] } },
    { id: "s4", placedAt: now - 5 * day, cart: { vendorId: "au-bon-pain", lines: [{ itemId: "bec-bagel", qty: 1, note: "" }] } },
  ];
  return orders.map((o) => ({ ...o, total: cartTotals(o.cart).total }));
}

function useOrdersOrSample() {
  const real = usePastOrders();
  const [sample, setSample] = useState<PastOrder[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- sample dates are relative to now, so build them after mount
    setSample(sampleOrders());
  }, []);
  if (real === null) return { orders: null, isSample: false };
  return real.length ? { orders: real, isSample: false } : { orders: sample, isSample: true };
}

function SampleNote() {
  return <p className="mt-4 text-xs text-muted">Sample orders. Yours show up here once you&rsquo;ve ordered.</p>;
}

function ReorderRow({ order }: { order: PastOrder }) {
  const { reorder, confirming, count } = useReorder(order);
  const { vendor, names } = orderSummary(order);
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="relative size-12 shrink-0 overflow-hidden rounded-lg border-2 border-ink">
        <Image src={vendor.image} alt="" fill sizes="48px" className="object-cover" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{vendor.name}</p>
        <p className="truncate text-sm text-muted">{names.join(", ")}</p>
        <p className="text-xs text-muted">
          {whenLabel(order.placedAt)} · {formatPrice(order.total)}
        </p>
      </div>
      <button
        type="button"
        onClick={reorder}
        className={`btn btn-sm shrink-0 px-3 ${confirming ? "btn-secondary" : "btn-primary"}`}
        aria-label={confirming ? `Replace your cart of ${count} with this ${vendor.name} order` : `Reorder from ${vendor.name}`}
      >
        {confirming ? "Replace?" : "Reorder"}
      </button>
    </li>
  );
}

/** Option 1: recent orders (and any cart in progress) beside the headline. */
export function HeroReorder() {
  const { orders, isSample } = useOrdersOrSample();
  const { cart, count } = useCart();
  const cartVendor = cart.vendorId ? findVendor(cart.vendorId) : undefined;

  return (
    <aside className="card p-5 sm:p-6" aria-labelledby="hero-reorder">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="hero-reorder" className="font-display text-2xl font-bold tracking-tight">
          Order again
        </h2>
        <span className="text-xs font-medium text-muted">Straight to checkout</span>
      </div>

      {cartVendor && count > 0 && (
        <Link
          href={`/market/${cartVendor.id}`}
          className="group mt-4 flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-[color-mix(in_srgb,var(--green)_12%,var(--surface))] px-4 py-3"
        >
          <span className="text-sm">
            <span className="block font-semibold">Finish your cart</span>
            <span className="text-muted">
              {count} {count === 1 ? "item" : "items"} from {cartVendor.name}
            </span>
          </span>
          <span aria-hidden className="transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </Link>
      )}

      {orders === null ? (
        <div className="mt-4 h-48 animate-pulse rounded-xl bg-ink/5" />
      ) : (
        <ul className="mt-2 divide-y-2 divide-dashed divide-ink/10">
          {orders.slice(0, 3).map((o) => (
            <ReorderRow key={o.id} order={o} />
          ))}
        </ul>
      )}
      {isSample && <SampleNote />}
    </aside>
  );
}

function useCountUp(to: number) {
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, to, {
      duration: reduce ? 0 : 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);
  return value;
}

/** Option 4: how much you've saved, as a big number. */
export function HeroSavings() {
  const { orders, isSample } = useOrdersOrSample();
  const list = orders ?? [];
  const perOrder = list.map((o) => ({ order: o, saved: Math.max(0, cartTotals(o.cart).savings) }));
  const total = perOrder.reduce((n, p) => n + p.saved, 0);
  const best = perOrder.reduce<(typeof perOrder)[number] | null>((b, p) => (!b || p.saved > b.saved ? p : b), null);
  const shown = useCountUp(total);

  return (
    <aside className="card rotate-1 p-6 sm:p-7" aria-labelledby="hero-savings">
      <p id="hero-savings" className="text-sm font-semibold text-muted">
        You&rsquo;ve saved
      </p>
      <p className="mt-1 font-display text-[clamp(3.5rem,7vw,5rem)] leading-none font-bold tracking-tight text-[var(--green)] tabular-nums">
        {orders === null ? <span className="block h-[1em] w-[3em] animate-pulse rounded-lg bg-ink/10" /> : formatPrice(shown)}
      </p>
      <p className="mt-2 text-muted">
        vs. menu prices, across {list.length} {list.length === 1 ? "order" : "orders"}
      </p>

      {/* One block per order, coloured by spot. */}
      <div className="mt-5 flex flex-wrap gap-1.5" aria-hidden>
        {perOrder.map(({ order }) => {
          const i = VENDORS.findIndex((v) => v.id === order.cart.vendorId);
          return (
            <span
              key={order.id}
              className="size-6 rounded-md border-2 border-ink"
              style={{ background: ACCENTS[Math.max(0, i) % ACCENTS.length] }}
            />
          );
        })}
        <span className="size-6 rounded-md border-2 border-dashed border-ink/30" />
      </div>

      {best && best.saved > 0 && (
        <p className="mt-5 border-t-2 border-dashed border-ink/10 pt-4 text-sm">
          Biggest save: <strong>{formatPrice(best.saved)}</strong> at {findVendor(best.order.cart.vendorId!)?.name}
        </p>
      )}
      {isSample && <SampleNote />}
    </aside>
  );
}

/** Floating picker for comparing the mockups. Remembers the choice in this browser. */
export function useHeroSide() {
  const [side, setSide] = useState<HeroSide>("reorder");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
      if (saved === "off" || saved === "reorder" || saved === "savings") setSide(saved);
    } catch {}
  }, []);
  const choose = (s: HeroSide) => {
    setSide(s);
    try {
      localStorage.setItem(STORAGE_KEY, s);
    } catch {}
  };
  return [side, choose] as const;
}

const OPTIONS: { id: HeroSide; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "reorder", label: "1 · Reorder" },
  { id: "savings", label: "4 · Savings" },
];

export function HeroSideSwitch({ side, onChange }: { side: HeroSide; onChange: (s: HeroSide) => void }) {
  return (
    <div
      role="group"
      aria-label="Headline side mockup"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-1 rounded-full border-2 border-ink bg-surface p-1 text-sm font-semibold shadow-[3px_3px_0_var(--ink)]"
    >
      <span className="px-2 text-xs text-muted">Mock</span>
      {OPTIONS.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={side === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-full px-3 py-1 ${side === o.id ? "bg-ink text-paper" : "hover:bg-ink/5"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
