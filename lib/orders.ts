"use client";

import { useEffect, useState } from "react";
import type { Cart } from "./cart";
import { findItem } from "./menu";

export type PastOrder = { id: string; cart: Cart; total: number; placedAt: number };

const STORAGE_KEY = "bm-orders";
const MAX_ORDERS = 6;

function read(): PastOrder[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

/** Saves a placed order on this device so it shows up under "Order again". */
export function saveOrder(order: PastOrder) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([order, ...read()].slice(0, MAX_ORDERS)));
  } catch {}
}

/** Past orders, newest first, with any items no longer on the menu dropped. Null until mounted. */
export function usePastOrders() {
  const [orders, setOrders] = useState<PastOrder[] | null>(null);

  useEffect(() => {
    const valid = read()
      .map((o) => ({
        ...o,
        cart: { ...o.cart, lines: o.cart.lines.filter((l) => o.cart.vendorId && findItem(o.cart.vendorId, l.itemId)) },
      }))
      .filter((o) => o.cart.lines.length > 0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
    setOrders(valid);
  }, []);

  return orders;
}
