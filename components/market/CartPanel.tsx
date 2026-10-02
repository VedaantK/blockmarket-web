"use client";

import Link from "next/link";
import { cartTotals, useCart } from "@/lib/cart";
import { findItem, formatPrice, ourPrice } from "@/lib/menu";
import { findVendor } from "@/lib/vendors";

function Stepper({ qty, name, onChange }: { qty: number; name: string; onChange: (qty: number) => void }) {
  return (
    <div className="flex items-center rounded-full border-2 border-ink">
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        aria-label={qty === 1 ? `Remove ${name}` : `One less ${name}`}
        className="grid size-8 place-items-center rounded-full hover:bg-ink/5"
      >
        {qty === 1 ? (
          <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : (
          <span aria-hidden>−</span>
        )}
      </button>
      <span className="w-6 text-center text-sm font-bold tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        aria-label={`One more ${name}`}
        className="grid size-8 place-items-center rounded-full hover:bg-ink/5"
      >
        <span aria-hidden>+</span>
      </button>
    </div>
  );
}

export function TotalsRows({ className = "" }: { className?: string }) {
  const { cart } = useCart();
  const t = cartTotals(cart);
  return (
    <dl className={`flex flex-col gap-2 text-sm ${className}`}>
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="tabular-nums">{formatPrice(t.subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Service fee</dt>
        <dd className="tabular-nums">{formatPrice(t.fee)}</dd>
      </div>
      <div className="mt-1 flex justify-between border-t-2 border-ink/10 pt-3 text-base font-bold">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatPrice(t.total)}</dd>
      </div>
      {t.savings > 0 && (
        <div className="mt-1 flex justify-between rounded-xl bg-[color-mix(in_srgb,var(--green)_12%,var(--surface))] px-3 py-2 font-semibold text-[var(--green)]">
          <dt>You save vs. menu price</dt>
          <dd className="tabular-nums">{formatPrice(t.savings)}</dd>
        </div>
      )}
    </dl>
  );
}

/** Cart contents with quantity controls. `checkout` hides the checkout button (used on the checkout page). */
export function CartPanel({ checkout = false }: { checkout?: boolean }) {
  const { cart, setQty } = useCart();
  const vendor = cart.vendorId ? findVendor(cart.vendorId) : undefined;

  if (!vendor || cart.lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 px-2 py-8 text-center">
        <span className="grid grid-cols-3 gap-1.5" aria-hidden>
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} className="size-4 rounded-[4px] border-2 border-ink/20" />
          ))}
        </span>
        <p className="font-display text-xl font-bold">Your cart is empty</p>
        <p className="text-sm text-muted">Add something from the menu to get started.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-sm text-muted">Your order from</p>
        <Link href={`/market/${vendor.id}`} className="font-display text-xl font-bold tracking-tight hover:underline">
          {vendor.name}
        </Link>
      </div>

      <ul className="flex flex-col gap-4">
        {cart.lines.map((line, i) => {
          const item = findItem(vendor.id, line.itemId);
          if (!item) return null;
          return (
            <li key={`${line.itemId}-${line.note}`} className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold leading-snug">{item.name}</p>
                {line.note && <p className="mt-0.5 text-sm text-muted">&ldquo;{line.note}&rdquo;</p>}
                <p className="mt-1 text-sm tabular-nums">{formatPrice(ourPrice(item.price) * line.qty)}</p>
              </div>
              <Stepper qty={line.qty} name={item.name} onChange={(q) => setQty(i, q)} />
            </li>
          );
        })}
      </ul>

      <TotalsRows className="border-t-2 border-dashed border-ink/15 pt-4" />

      {!checkout && (
        <Link href="/market/checkout" className="btn btn-primary justify-center">
          Go to checkout
          <span aria-hidden className="btn-arrow">
            →
          </span>
        </Link>
      )}
    </div>
  );
}
