"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { findItem, formatPrice } from "@/lib/menu";
import { usePastOrders, type PastOrder } from "@/lib/orders";
import { findVendor } from "@/lib/vendors";

export function whenLabel(placedAt: number) {
  const days = Math.floor((Date.now() - placedAt) / 86_400_000);
  if (days < 1) return "Today";
  if (days < 2) return "Yesterday";
  if (days < 7) return new Date(placedAt).toLocaleDateString("en-US", { weekday: "long" });
  return new Date(placedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Reorder button state: swaps the cart for this order and heads to checkout, asking first if that would replace something. */
export function useReorder(order: PastOrder) {
  const router = useRouter();
  const { cart, count, restore } = useCart();
  const [confirming, setConfirming] = useState(false);
  const wouldReplace = count > 0 && JSON.stringify(cart) !== JSON.stringify(order.cart);

  // The "Replace cart?" prompt backs off on its own after a few seconds.
  useEffect(() => {
    if (!confirming) return;
    const id = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(id);
  }, [confirming]);

  const reorder = () => {
    if (wouldReplace && !confirming) return setConfirming(true);
    restore(order.cart);
    router.push("/market/checkout");
  };

  return { reorder, confirming, count };
}

export function orderSummary(order: PastOrder) {
  const vendor = findVendor(order.cart.vendorId!)!;
  const names = order.cart.lines.map((l) => `${l.qty > 1 ? `${l.qty}× ` : ""}${findItem(vendor.id, l.itemId)?.name}`);
  const items = order.cart.lines.reduce((n, l) => n + l.qty, 0);
  return { vendor, names, items };
}

function OrderCard({ order }: { order: PastOrder }) {
  const { reorder, confirming, count } = useReorder(order);
  const { vendor, names, items } = orderSummary(order);

  return (
    <article className="tile flex w-72 shrink-0 snap-start flex-col gap-4 p-4 sm:w-80">
      <div className="flex items-center gap-3">
        <span className="relative size-14 shrink-0 overflow-hidden rounded-lg border-2 border-ink">
          <Image src={vendor.image} alt="" fill sizes="56px" className="object-cover" />
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold tracking-tight">{vendor.name}</h3>
          <p className="text-sm text-muted">
            {whenLabel(order.placedAt)} · {items} {items === 1 ? "item" : "items"} · {formatPrice(order.total)}
          </p>
        </div>
      </div>
      <p className="line-clamp-2 min-h-[2.5rem] text-sm">{names.join(", ")}</p>
      <button
        type="button"
        onClick={reorder}
        className={`btn btn-sm justify-center ${confirming ? "btn-secondary" : "btn-primary"}`}
        aria-live="polite"
      >
        {confirming ? `Replace your cart (${count})?` : "Reorder"}
        <span aria-hidden className="btn-arrow">
          →
        </span>
      </button>
    </article>
  );
}

/** One-tap reorder of recent orders placed on this device. */
export function OrderAgain() {
  const orders = usePastOrders();

  return (
    <section className="mt-12" aria-labelledby="order-again">
      <div className="mx-auto flex w-full max-w-6xl items-baseline justify-between gap-4 px-4 sm:px-8">
        <h2 id="order-again" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Order again
        </h2>
        <p className="text-sm text-muted">Straight to checkout</p>
      </div>
      <div className="rail mt-5 flex snap-x gap-4 overflow-x-auto pt-1 pb-5">
        {orders === null ? (
          <div className="h-[11.5rem] w-72 shrink-0 animate-pulse rounded-[14px] bg-ink/5 sm:w-80" />
        ) : orders.length ? (
          orders.map((o) => <OrderCard key={o.id} order={o} />)
        ) : (
          <div className="placeholder-card flex min-h-[11.5rem] w-full max-w-md shrink-0 flex-col justify-center gap-1 p-6">
            <p className="font-display text-lg font-bold">Nothing to reorder yet</p>
            <p className="text-sm text-muted">Your recent orders will show up here so you can get them again in one tap.</p>
          </div>
        )}
      </div>
    </section>
  );
}
