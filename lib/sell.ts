// Seller side. Incoming orders are simulated until there's a backend.

import { cartTotals, type Cart } from "./cart";
import { getMenu } from "./menu";
import { isOpen, VENDORS } from "./vendors";

export type IncomingOrder = {
  id: string;
  cart: Cart;
  /** What the seller is paid for filling it, in cents. */
  payout: number;
  postedAt: number;
  expiresAt: number;
};

export type Payout = { id: string; vendorId: string; amount: number; at: number };

/** How long an order waits in the bank before another seller is likely to grab it. */
export const ORDER_TTL = 2 * 60_000;

/** How long a seller has to place an order after accepting it. */
export const PLACE_WINDOW = 5 * 60_000;

/** Seller gets what the buyer pays for the food; the service fee stays with Block Market. Placeholder. */
export function sellerPayout(cart: Cart) {
  return cartTotals(cart).subtotal;
}

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

/** A random order from a spot that's open right now, or null if none are. */
export function randomOrder(now: number): IncomingOrder | null {
  const open = VENDORS.filter((v) => isOpen(v, now));
  if (!open.length) return null;
  const vendor = pick(open);
  const items = getMenu(vendor.id).flatMap((s) => s.items);
  const first = pick(items);
  const lines = [{ itemId: first.id, qty: 1, note: "" }];
  // About a third of orders add a second, different item.
  const second = pick(items);
  if (Math.random() < 0.35 && second.id !== first.id) lines.push({ itemId: second.id, qty: 1, note: "" });
  const cart = { vendorId: vendor.id, lines };
  return {
    id: Math.random().toString(36).slice(2, 7).toUpperCase(),
    cart,
    payout: sellerPayout(cart),
    postedAt: now,
    expiresAt: now + ORDER_TTL,
  };
}

/** A week of made-up payouts so the dashboard has something to show on first visit. */
export function samplePayouts(now: number): Payout[] {
  const day = 86_400_000;
  const perDay = [2, 0, 3, 1, 2, 4, 1];
  const amounts = [717, 657, 690, 777, 477, 750, 597, 297, 657];
  const out: Payout[] = [];
  let k = 0;
  perDay.forEach((n, d) => {
    for (let i = 0; i < n; i++, k++) {
      out.push({
        id: `sample-${k}`,
        vendorId: VENDORS[k % VENDORS.length].id,
        amount: amounts[k % amounts.length],
        at: now - (6 - d) * day - (i + 1) * 2 * 3_600_000,
      });
    }
  });
  return out.sort((a, b) => b.at - a.at);
}

/** Start of the local day `daysAgo` days back. */
export function dayStart(now: number, daysAgo: number) {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.getTime();
}
