"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cartTotals, useCart } from "@/lib/cart";
import { DISCOUNT, findItem, formatPrice, getMenu, ourPrice, type MenuItem, type MenuSection } from "@/lib/menu";
import { useNow } from "@/lib/useNow";
import { findVendor, hoursLabel, isOpen } from "@/lib/vendors";
import { CartPanel } from "./CartPanel";
import { ItemDialog } from "./ItemDialog";

function ItemTile({ item, onOpen }: { item: MenuItem; onOpen: () => void }) {
  return (
    <button type="button" onClick={onOpen} className="menu-item tile group flex items-start justify-between gap-4 p-5 text-left">
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-semibold leading-snug">{item.name}</span>
          {item.popular && (
            <span className="rounded-full bg-[color-mix(in_srgb,var(--red)_14%,var(--surface))] px-2 py-0.5 text-xs font-semibold text-[var(--red)]">
              Popular
            </span>
          )}
        </span>
        <span className="mt-1 line-clamp-2 block text-sm text-muted">{item.description}</span>
        <span className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-bold">{formatPrice(ourPrice(item.price))}</span>
          <s className="text-sm text-muted">{formatPrice(item.price)}</s>
        </span>
      </span>
      <span
        aria-hidden
        className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink bg-surface text-xl transition-colors group-hover:bg-ink group-hover:text-paper"
      >
        +
      </span>
    </button>
  );
}

export function VendorStore({ vendorId }: { vendorId: string }) {
  const vendor = findVendor(vendorId)!;
  const now = useNow();
  const reduce = useReducedMotion();
  const { cart, count } = useCart();
  const [openItem, setOpenItem] = useState<MenuItem | null>(null);
  const [sheet, setSheet] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const closed = now !== null && !isOpen(vendor, now);
  const menu = getMenu(vendor.id);
  const popular = menu.flatMap((s) => s.items.filter((i) => i.popular));
  const sections: MenuSection[] = popular.length ? [{ id: "popular", title: "Popular", items: popular }, ...menu] : menu;

  const cartHere = cart.vendorId === vendor.id && count > 0;
  const totals = cartTotals(cart);

  // Links like ?item=orange-chicken open that item straight away.
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("item");
    const item = id ? findItem(vendor.id, id) : undefined;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL after mount
    if (item) setOpenItem(item);
  }, [vendor.id]);

  // Highlight the menu tab for the last section whose heading has scrolled under the tab bar.
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const onScroll = () => {
      const line = (tabsRef.current?.getBoundingClientRect().bottom ?? 0) + 24;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(`section-${id}`);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sections only change with the vendor
  }, [vendor.id]);

  // Escape closes the phone cart sheet.
  useEffect(() => {
    if (!sheet) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sheet]);

  // Keep the active tab visible in the scrolling tab bar.
  useEffect(() => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    tab?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [active]);

  return (
    <div className="pb-28">
      <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-8">
        <Link href="/market" className="inline-flex items-center gap-2 font-semibold text-muted hover:text-ink">
          <span aria-hidden>←</span> All spots
        </Link>

        <div className="card relative mt-4 aspect-[16/7] overflow-hidden sm:aspect-[16/5]">
          <Image src={vendor.image} alt={`Food from ${vendor.name}`} fill priority sizes="(min-width: 1152px) 1088px, 100vw" className="object-cover" />
          <span className="absolute right-4 bottom-4 -rotate-2 rounded-xl border-2 border-ink bg-surface px-3 py-1.5 font-display text-lg font-bold shadow-[3px_3px_0_var(--ink)] sm:text-xl">
            Everything {Math.round(DISCOUNT * 100)}% off
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-bold leading-none tracking-tight">{vendor.name}</h1>
            <p className="mt-2 text-muted">
              {vendor.cuisine} · Pickup in {vendor.readyMins[0]}–{vendor.readyMins[1]} min
            </p>
          </div>
          {now !== null && (
            <span
              className={`inline-flex items-center gap-2 self-start rounded-full border-2 px-3 py-1.5 text-sm font-semibold md:self-auto ${
                closed ? "border-ink/20 text-muted" : "border-ink"
              }`}
            >
              <span className={`size-2 rounded-full ${closed ? "bg-[var(--red)]" : "bg-[var(--green)]"}`} />
              {hoursLabel(vendor, now)}
            </span>
          )}
        </div>
      </div>

      <div className="sticky top-[var(--header-h)] z-30 mt-8 border-y-2 border-ink/10 bg-paper">
        <div ref={tabsRef} className="mx-auto flex w-full max-w-6xl gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] sm:px-8" aria-label="Menu sections">
          {sections.map((s) => (
            <a key={s.id} href={`#section-${s.id}`} data-tab={s.id} className="chip" aria-current={active === s.id ? "true" : undefined}>
              {s.title}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 pt-8 sm:px-8 lg:grid-cols-[1fr_21rem]">
        <div className="flex flex-col gap-12">
          {closed && (
            <p className="rounded-2xl border-2 border-dashed border-ink/25 px-5 py-4 text-muted">
              {vendor.name} is closed right now. You can look around, and order once it opens.
            </p>
          )}
          {sections.map((s) => (
            <section key={s.id} id={`section-${s.id}`} className="scroll-mt-[calc(var(--header-h)+5rem)]">
              <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{s.title}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {s.items.map((item) => (
                  <ItemTile key={item.id} item={item} onOpen={() => setOpenItem(item)} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="hidden lg:block">
          <div className="card sticky top-[calc(var(--header-h)+5rem)] p-6">
            <CartPanel />
          </div>
        </aside>
      </div>

      {/* Phones: a bar at the bottom that opens the cart as a sheet. */}
      <AnimatePresence>
        {cartHere && !sheet && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { y: "110%" }}
            animate={reduce ? { opacity: 1 } : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "110%" }}
            transition={{ type: "spring", stiffness: 380, damping: 34 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-paper px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
          >
            <button type="button" onClick={() => setSheet(true)} className="btn btn-primary w-full justify-between">
              <span className="grid size-6 place-items-center rounded-full bg-paper text-sm font-bold text-ink tabular-nums">{count}</span>
              View cart
              <span className="tabular-nums">{formatPrice(totals.total)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sheet && (
          <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Your cart">
            <motion.button
              type="button"
              aria-label="Close cart"
              onClick={() => setSheet(false)}
              className="absolute inset-0 bg-ink/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={reduce ? { opacity: 0 } : { y: "100%" }}
              animate={reduce ? { opacity: 1 } : { y: 0 }}
              exit={reduce ? { opacity: 0 } : { y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl border-t-2 border-ink bg-surface px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]"
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/15" aria-hidden />
              <CartPanel />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ItemDialog item={openItem} vendor={vendor} closed={closed} onClose={() => setOpenItem(null)} />
    </div>
  );
}
