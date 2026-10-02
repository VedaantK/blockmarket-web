"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { DISCOUNT, formatPrice, getMenu, ourPrice } from "@/lib/menu";
import { useNow } from "@/lib/useNow";
import { MealPill } from "./MealPill";
import { HeroReorder, HeroSavings, HeroSideSwitch, useHeroSide } from "./HeroSide";
import { OrderAgain } from "./OrderAgain";
import { easternHour, findVendor, formatHour, hoursLabel, isOpen, matchesQuery, VENDORS, type Vendor } from "@/lib/vendors";

const ACCENTS = ["var(--green)", "var(--blue)", "var(--red)"];
const OFF = `${Math.round(DISCOUNT * 100)}% off`;

function accent(v: Vendor) {
  return ACCENTS[VENDORS.indexOf(v) % ACCENTS.length];
}

/** Vendor name, cuisine and tags, plus anything on its menu. */
function vendorMatches(v: Vendor, query: string) {
  if (matchesQuery(v, query)) return true;
  const q = query.trim().toLowerCase();
  return getMenu(v.id).some((s) => s.items.some((i) => i.name.toLowerCase().includes(q)));
}

// Round-robin across spots so neighbouring cards aren't from the same place.
const POPULAR = (() => {
  const lists = VENDORS.map((v) => getMenu(v.id).flatMap((s) => s.items.filter((i) => i.popular).map((item) => ({ vendor: v, item }))));
  const out = [];
  for (let i = 0; lists.some((l) => i < l.length); i++) for (const l of lists) if (l[i]) out.push(l[i]);
  return out;
})();

const TILTS = ["hover:-rotate-1", "hover:rotate-1"];

function VendorCard({ vendor, now }: { vendor: Vendor; now: number | null }) {
  const closed = now !== null && !isOpen(vendor, now);
  return (
    <Link
      href={`/market/${vendor.id}`}
      className="vendor-card group card flex flex-col overflow-hidden"
      style={{ "--accent": accent(vendor) } as React.CSSProperties}
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-ink">
        <Image
          src={vendor.image}
          alt=""
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className={`object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none ${closed ? "grayscale" : ""}`}
        />
        <span
          className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-on-color"
          style={{ background: accent(vendor) }}
        >
          {vendor.cuisine}
        </span>
        {closed ? (
          <span className="absolute inset-0 grid place-items-center bg-ink/45">
            <span className="rounded-full border-2 border-ink bg-surface px-4 py-1.5 font-semibold">
              Opens {formatHour(vendor.hours.open)}
            </span>
          </span>
        ) : (
          <span className="absolute top-3 right-3 rotate-3 rounded-lg border-2 border-ink bg-surface px-2.5 py-1 font-display text-sm font-bold shadow-[2px_2px_0_var(--ink)]">
            {OFF}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
            <h3 className="truncate font-display text-xl font-bold tracking-tight">{vendor.name}</h3>
            <p className="mt-0.5 text-sm text-muted">{now === null ? " " : hoursLabel(vendor, now)}</p>
          </div>
          <span className="shrink-0 rounded-full bg-ink/5 px-3 py-1 text-sm font-semibold tabular-nums">
            {vendor.readyMins[0]}–{vendor.readyMins[1]} min
          </span>
        </div>
      </Link>
    );
  }

  export function MarketHome() {
    const now = useNow();
    const { cart, count } = useCart();
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [side, setSide] = useHeroSide();

    const searching = query.trim() !== "";
    const results = VENDORS.filter((v) => vendorMatches(v, query));
    // Open spots first, then the ones that are closed right now.
    const sorted = now === null ? results : [...results].sort((a, b) => Number(isOpen(b, now)) - Number(isOpen(a, now)));
    const cartVendor = cart.vendorId ? findVendor(cart.vendorId) : undefined;

    // "/" focuses the search, same as on the home page.
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key !== "/" || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
        e.preventDefault();
        inputRef.current?.focus();
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
      <div className="pb-24">
        <section
          className={`mx-auto w-full max-w-6xl px-4 pt-10 sm:px-8 sm:pt-14 ${
            side === "off" ? "" : "grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center"
          }`}
        >
          <div className="min-w-0">
          <MealPill hour={now === null ? null : easternHour(now)} />
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,5.5vw,4rem)] font-bold leading-[1.02] tracking-tight">
            What are you craving?
          </h1>
          <p className="mt-3 max-w-xl text-lg text-muted">
            Everything is {OFF} menu price. A student with spare blocks pays for it, you pick it up.
          </p>

          <div className="mt-8">
            <label className="search w-full max-w-2xl">
              <span className="sr-only">Search spots or dishes</span>
              <svg aria-hidden viewBox="0 0 20 20" className="size-5 shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="m13 13 4 4" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setQuery("")}
                placeholder="Search spots or dishes, like lo mein"
                className="w-full bg-transparent outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
              />
              {searching ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="text-sm font-medium text-muted hover:text-ink"
                >
                  Clear
                </button>
              ) : (
                <kbd className="hidden rounded-md border border-ink/20 px-1.5 text-xs text-muted md:inline">/</kbd>
              )}
            </label>

          </div>

          {side !== "reorder" && cartVendor && count > 0 && (
            <Link
              href={`/market/${cartVendor.id}`}
              className="group mt-8 flex items-center justify-between gap-4 rounded-2xl border-2 border-ink bg-[color-mix(in_srgb,var(--green)_12%,var(--surface))] px-5 py-4"
            >
              <span>
                <span className="block font-semibold">Pick up where you left off</span>
                <span className="text-sm text-muted">
                  {count} {count === 1 ? "item" : "items"} from {cartVendor.name}
                </span>
              </span>
              <span aria-hidden className="text-xl transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
                →
              </span>
            </Link>
          )}
        </div>
        {side === "reorder" && <HeroReorder />}
        {side === "savings" && <HeroSavings />}
      </section>

      {!searching && side !== "reorder" && <OrderAgain />}

      {!searching && (
        <section className="mt-10">
          <h2 className="mx-auto w-full max-w-6xl px-4 font-display text-2xl font-bold tracking-tight sm:px-8 sm:text-3xl">
            Popular right now
          </h2>
          <div className="rail mt-5 flex snap-x gap-4 overflow-x-auto pt-1 pb-5">
            {POPULAR.map(({ vendor, item }, rank) => (
              <Link
                key={`${vendor.id}-${item.id}`}
                href={`/market/${vendor.id}?item=${item.id}`}
                className={`vendor-card group tile flex w-56 shrink-0 snap-start flex-col overflow-hidden ${TILTS[rank % 2]}`}
                style={{ "--accent": accent(vendor) } as React.CSSProperties}
              >
                <div className="relative aspect-[4/3] overflow-hidden border-b-2 border-ink">
                  <Image src={vendor.image} alt="" fill sizes="224px" className="object-cover" />
                  <span
                    className="absolute top-2.5 left-2.5 grid size-9 -rotate-6 place-items-center rounded-lg border-2 border-ink font-display text-sm font-bold text-on-color shadow-[2px_2px_0_var(--ink)]"
                    style={{ background: accent(vendor) }}
                  >
                    #{rank + 1}
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-4 py-3">
                  <span className="font-semibold leading-snug">{item.name}</span>
                  <span className="text-sm text-muted">{vendor.name}</span>
                  <span className="mt-auto flex items-baseline gap-2 pt-2">
                    <span className="font-display text-lg font-bold">{formatPrice(ourPrice(item.price))}</span>
                    <s className="text-sm text-muted">{formatPrice(item.price)}</s>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto mt-12 w-full max-w-6xl px-4 sm:px-8">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {searching ? "Results" : "All spots"}
          </h2>
          <p className="text-sm text-muted" aria-live="polite">
            {sorted.length} {sorted.length === 1 ? "spot" : "spots"}
          </p>
        </div>

        {sorted.length > 0 ? (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((v) => (
              <VendorCard key={v.id} vendor={v} now={now} />
            ))}
          </div>
        ) : (
          <div className="placeholder-card mt-6 flex min-h-48 flex-col items-start justify-center gap-2 p-8">
            <p className="font-display text-2xl font-bold">Nothing matches &ldquo;{query.trim()}&rdquo;</p>
            <p className="text-muted">Try a dish instead, like pizza or bagel.</p>
          </div>
        )}
      </section>
      <HeroSideSwitch side={side} onChange={setSide} />
    </div>
  );
}
