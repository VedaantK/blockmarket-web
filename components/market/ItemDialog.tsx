"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { DISCOUNT, formatPrice, ourPrice, type MenuItem } from "@/lib/menu";
import { findVendor, type Vendor } from "@/lib/vendors";

function Body({ item, vendor, closed, onDone }: { item: MenuItem; vendor: Vendor; closed: boolean; onDone: () => void }) {
  const { cart, add, replace } = useCart();
  const noteId = useId();
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [conflict, setConflict] = useState(false);

  const line = { itemId: item.id, qty, note: note.trim() };
  const otherVendor = cart.vendorId ? findVendor(cart.vendorId) : undefined;

  if (conflict) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <h2 className="font-display text-2xl font-bold tracking-tight">Start a new cart?</h2>
        <p className="text-muted">
          Your cart has items from {otherVendor?.name ?? "another spot"}. Orders can only come from one spot at a time.
        </p>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row-reverse">
          <button
            type="button"
            className="btn btn-primary justify-center"
            onClick={() => {
              replace(vendor.id, line);
              onDone();
            }}
          >
            Start new cart
          </button>
          <button type="button" className="btn justify-center bg-surface" onClick={onDone}>
            Keep current cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{item.name}</h2>
          <form method="dialog">
            <button aria-label="Close" className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-ink hover:bg-ink/5">
              <svg aria-hidden viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m5 5 10 10M15 5 5 15" strokeLinecap="round" />
              </svg>
            </button>
          </form>
        </div>
        <p className="text-muted">{item.description}</p>
        <p className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold">{formatPrice(ourPrice(item.price))}</span>
          <s className="text-muted">{formatPrice(item.price)}</s>
          <span className="rounded-full bg-[var(--green)] px-2 py-0.5 text-xs font-semibold text-on-color">
            {Math.round(DISCOUNT * 100)}% off
          </span>
        </p>

        <div className="mt-2 flex flex-col gap-2">
          <label htmlFor={noteId} className="text-sm font-semibold">
            Special instructions <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id={noteId}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={140}
            rows={2}
            placeholder="No onions, extra sauce…"
            className="pace-input h-auto resize-none py-2 font-normal [--plan:var(--blue)]"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t-2 border-ink px-6 py-4">
        <div className="flex items-center rounded-full border-2 border-ink">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty === 1}
            aria-label="One less"
            className="grid size-11 place-items-center rounded-full text-lg hover:bg-ink/5 disabled:opacity-30"
          >
            −
          </button>
          <span className="w-7 text-center font-bold tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(20, q + 1))}
            aria-label="One more"
            className="grid size-11 place-items-center rounded-full text-lg hover:bg-ink/5"
          >
            +
          </button>
        </div>
        <button
          type="button"
          disabled={closed}
          onClick={() => (add(vendor.id, line) ? onDone() : setConflict(true))}
          className="btn btn-primary flex-1 justify-center disabled:pointer-events-none disabled:opacity-40"
        >
          {closed ? "Closed right now" : `Add to cart · ${formatPrice(ourPrice(item.price) * qty)}`}
        </button>
      </div>
    </>
  );
}

/** Item details sheet. Open whenever `item` is set; `onClose` clears it. */
export function ItemDialog({
  item,
  vendor,
  closed,
  onClose,
}: {
  item: MenuItem | null;
  vendor: Vendor;
  closed: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (item && !d.open) d.showModal();
    if (!item && d.open) d.close();
  }, [item]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      // Clicking the backdrop (the dialog element itself, outside the card) closes it.
      onClick={(e) => e.target === ref.current && ref.current.close()}
      aria-label={item?.name}
      className="item-dialog card m-auto w-[min(32rem,calc(100vw-2rem))] p-0 text-ink"
    >
      {item && <Body key={item.id} item={item} vendor={vendor} closed={closed} onDone={() => ref.current?.close()} />}
    </dialog>
  );
}
