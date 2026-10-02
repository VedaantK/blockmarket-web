"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { findItem, ourPrice, SERVICE_FEE } from "./menu";

export type CartLine = { itemId: string; qty: number; note: string };

/** A cart only ever holds items from one vendor, like most ordering apps. */
export type Cart = { vendorId: string | null; lines: CartLine[] };

const EMPTY: Cart = { vendorId: null, lines: [] };
const STORAGE_KEY = "bm-cart";

type CartApi = {
  cart: Cart;
  count: number;
  /** Returns false (and changes nothing) if the cart holds another vendor's items. */
  add: (vendorId: string, line: CartLine) => boolean;
  /** Empties the cart and starts a new one with this line. */
  replace: (vendorId: string, line: CartLine) => void;
  setQty: (index: number, qty: number) => void;
  /** Swaps the whole cart for this one, e.g. to reorder a past order. */
  restore: (cart: Cart) => void;
  clear: () => void;
};

const CartContext = createContext<CartApi | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  // Keep the cart across page loads in this tab.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage after mount
      if (saved) setCart(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {}
  }, [cart, loaded]);

  const merge = (c: Cart, line: CartLine): Cart => {
    const i = c.lines.findIndex((l) => l.itemId === line.itemId && l.note === line.note);
    if (i === -1) return { ...c, lines: [...c.lines, line] };
    return { ...c, lines: c.lines.map((l, j) => (j === i ? { ...l, qty: l.qty + line.qty } : l)) };
  };

  const api: CartApi = {
    cart,
    count: cart.lines.reduce((n, l) => n + l.qty, 0),
    add: (vendorId, line) => {
      if (cart.vendorId && cart.vendorId !== vendorId && cart.lines.length > 0) return false;
      setCart((c) => merge({ vendorId, lines: c.vendorId === vendorId ? c.lines : [] }, line));
      return true;
    },
    replace: (vendorId, line) => setCart({ vendorId, lines: [line] }),
    setQty: (index, qty) =>
      setCart((c) => {
        const lines = qty <= 0 ? c.lines.filter((_, i) => i !== index) : c.lines.map((l, i) => (i === index ? { ...l, qty } : l));
        return lines.length ? { ...c, lines } : EMPTY;
      }),
    restore: (c) => setCart(c),
    clear: () => setCart(EMPTY),
  };

  return <CartContext value={api}>{children}</CartContext>;
}

export function useCart() {
  const api = useContext(CartContext);
  if (!api) throw new Error("useCart must be used inside <CartProvider>");
  return api;
}

/** Money for a cart, in cents. */
export function cartTotals(cart: Cart) {
  let menu = 0;
  let subtotal = 0;
  for (const line of cart.lines) {
    const item = cart.vendorId ? findItem(cart.vendorId, line.itemId) : undefined;
    if (!item) continue;
    menu += item.price * line.qty;
    subtotal += ourPrice(item.price) * line.qty;
  }
  const fee = cart.lines.length ? SERVICE_FEE : 0;
  return { menu, subtotal, fee, total: subtotal + fee, savings: menu - subtotal - fee };
}
