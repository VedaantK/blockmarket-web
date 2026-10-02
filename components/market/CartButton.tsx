"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/market/checkout"
      aria-label={count ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart, empty"}
      className="relative grid size-10 place-items-center rounded-full border-2 border-ink bg-surface hover:bg-ink/5"
    >
      <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 7h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9z" strokeLinejoin="round" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" strokeLinecap="round" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-ink bg-[var(--green)] px-1 text-[11px] font-bold text-on-color tabular-nums">
          {count}
        </span>
      )}
    </Link>
  );
}
