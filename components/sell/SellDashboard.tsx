"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/menu";
import { dayStart, PLACE_WINDOW, randomOrder, samplePayouts, type IncomingOrder, type Payout } from "@/lib/sell";
import { useNow } from "@/lib/useNow";
import { findVendor } from "@/lib/vendors";
import { ActiveOrder, type Active } from "./ActiveOrder";
import { EarningsChart } from "./EarningsChart";
import { OrderBank } from "./OrderBank";

const PAYOUTS_KEY = "bm-payouts";
const MAX_WAITING = 5;
/** Demo: how long after "I've placed it" the buyer shows up. */
const PICKUP_DELAY = 6_000;

function usePayouts(now: number | null) {
  const [payouts, setPayouts] = useState<Payout[] | null>(null);
  const [isSample, setIsSample] = useState(false);

  useEffect(() => {
    if (now === null || payouts !== null) return;
    let saved: Payout[] | null = null;
    try {
      saved = JSON.parse(localStorage.getItem(PAYOUTS_KEY) ?? "null");
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading browser storage once the clock is ready
    setPayouts(saved ?? samplePayouts(now));
    setIsSample(!saved);
  }, [now, payouts]);

  const add = (p: Payout) =>
    setPayouts((list) => {
      const next = [p, ...(list ?? [])];
      try {
        localStorage.setItem(PAYOUTS_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });

  const reset = () => {
    try {
      localStorage.removeItem(PAYOUTS_KEY);
    } catch {}
    setPayouts(null);
  };

  return { payouts, isSample, add, reset };
}

function Stat({ label, value, sub, color }: { label: string; value: React.ReactNode; sub?: React.ReactNode; color: string }) {
  return (
    <div className="tile flex flex-col gap-1 px-4 py-3 sm:px-5">
      <span className="flex items-baseline justify-between gap-2 text-sm font-medium text-muted">
        {label}
        {sub && <span className="text-xs font-normal">{sub}</span>}
      </span>
      <span
        className="font-display text-[clamp(1.75rem,3.5vw,2.4rem)] leading-none font-bold tracking-tight tabular-nums"
        style={{ color }}
      >
        {value}
      </span>
    </div>
  );
}

export function SellDashboard() {
  const reduce = useReducedMotion();
  const now = useNow();
  // Timers read the latest clock without restarting every second.
  const nowRef = useRef(now);
  useEffect(() => {
    nowRef.current = now;
  }, [now]);

  const [bank, setBank] = useState<IncomingOrder[]>([]);
  const [active, setActive] = useState<Active | null>(null);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const { payouts, isSample, add, reset } = usePayouts(now);
  const ready = now !== null;

  const flash = (text: string) => setToast({ id: Date.now(), text });

  // New orders trickle in every few seconds.
  useEffect(() => {
    if (!ready) return;
    const push = () => {
      const t = nowRef.current;
      const order = t === null ? null : randomOrder(t);
      if (!order) return;
      setBank((b) => [order, ...b.filter((o) => o.expiresAt > t!)].slice(0, MAX_WAITING));
    };
    // A couple straight away so the bank isn't empty when you arrive.
    push();
    const first = setTimeout(push, 900);
    let next: ReturnType<typeof setTimeout>;
    const schedule = () => {
      next = setTimeout(
        () => {
          push();
          schedule();
        },
        5_000 + Math.random() * 7_000,
      );
    };
    schedule();
    return () => {
      clearTimeout(first);
      clearTimeout(next);
    };
  }, [ready]);

  // Run out the clock on an accepted order, and fake the buyer's pickup.
  useEffect(() => {
    if (active?.stage !== "place") return;
    const left = active.acceptedAt + PLACE_WINDOW - (nowRef.current ?? active.acceptedAt);
    const id = setTimeout(() => {
      setActive(null);
      flash("Time ran out, so the order went back to the bank");
    }, left);
    return () => clearTimeout(id);
  }, [active]);

  useEffect(() => {
    if (active?.stage !== "pickup") return;
    const id = setTimeout(() => {
      const t = nowRef.current ?? Date.now();
      add({ id: active.order.id, vendorId: active.order.cart.vendorId!, amount: active.order.payout, at: t });
      flash(`+${formatPrice(active.order.payout)} earned`);
      setActive(null);
    }, PICKUP_DELAY);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `add` is stable in practice; only rerun when the stage changes
  }, [active]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(id);
  }, [toast]);

  const waiting = now === null ? [] : bank.filter((o) => o.expiresAt > now);
  const list = payouts ?? [];
  const today = now === null ? [] : list.filter((p) => p.at >= dayStart(now, 0));
  const week = now === null ? [] : list.filter((p) => p.at >= dayStart(now, 6));
  const sum = (ps: Payout[]) => ps.reduce((n, p) => n + p.amount, 0);

  const accept = (order: IncomingOrder) => {
    if (active || now === null) return;
    setBank((b) => b.filter((o) => o.id !== order.id));
    setActive({ order, acceptedAt: now, stage: "place" });
  };

  const avg = week.length ? Math.round(sum(week) / week.length) : 0;

  return (
    // Desktop: exactly one screen tall, with the bank and payouts scrolling inside their boxes.
    <div className="mx-auto flex w-full max-w-6xl flex-col px-4 pt-8 pb-10 sm:px-8 lg:h-[max(44rem,calc(100dvh-var(--header-h)))] lg:pb-8">
      <div className="shrink-0">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <h1 className="font-display text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.02] font-bold tracking-tight">
            Sell your blocks
          </h1>
          <p className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-3 py-1 text-sm font-medium">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[var(--green)] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-[var(--green)]" />
            </span>
            Seller dashboard
          </p>
        </div>
        <p className="mt-2 text-lg text-muted">Accept an order, pay for it with a block at the counter, get paid at pickup.</p>
      </div>

      <div className="mt-5 grid shrink-0 grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Earned today"
          value={payouts ? formatPrice(sum(today)) : "–"}
          sub={`${today.length} ${today.length === 1 ? "order" : "orders"}`}
          color="var(--green)"
        />
        <Stat label="This week" value={payouts ? formatPrice(sum(week)) : "–"} sub="Last 7 days" color="var(--blue)" />
        <Stat label="Orders filled" value={payouts ? week.length : "–"} sub="This week" color="var(--red)" />
        <Stat label="Avg payout" value={payouts && avg ? formatPrice(avg) : "–"} sub="Per order this week" color="var(--ink)" />
      </div>

      <div className="mt-6 grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="flex min-h-0 flex-col">
          <OrderBank
            orders={waiting}
            now={now}
            locked={active !== null}
            onAccept={accept}
            pinned={
              <AnimatePresence>
                {active && now !== null && (
                  <ActiveOrder
                    key={active.order.id}
                    active={active}
                    now={now}
                    onPlaced={() => setActive({ ...active, stage: "pickup" })}
                    onRelease={() => {
                      setActive(null);
                      flash("Order released back to the bank");
                    }}
                  />
                )}
              </AnimatePresence>
            }
          />
        </div>

        <div className="flex min-h-0 flex-col gap-6">
          {now !== null && <EarningsChart payouts={list} now={now} />}

          <section className="card flex min-h-0 flex-1 flex-col p-5" aria-labelledby="recent">
            <div className="flex shrink-0 items-baseline justify-between gap-3">
              <h2 id="recent" className="font-display text-xl font-bold tracking-tight">
                Recent payouts
              </h2>
              {isSample ? (
                <span className="text-xs text-muted">Sample data</span>
              ) : (
                list.length > 0 && (
                  <button
                    type="button"
                    onClick={reset}
                    className="text-xs font-medium text-muted underline underline-offset-2 hover:text-ink"
                  >
                    Reset to sample
                  </button>
                )
              )}
            </div>
            <ul className="mt-2 min-h-0 flex-1 divide-y-2 divide-dashed divide-ink/10 overflow-y-auto max-lg:max-h-80">
              {list.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{findVendor(p.vendorId)?.name}</span>
                    <span className="text-muted">
                      {new Date(p.at).toLocaleDateString("en-US", { weekday: "short" })} ·{" "}
                      {new Date(p.at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </span>
                  </span>
                  <span className="font-semibold text-[var(--green)] tabular-nums">+{formatPrice(p.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" aria-live="polite">
        <AnimatePresence>
          {toast && (
            <motion.p
              key={toast.id}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 420, damping: 28 }}
              className="rounded-full border-2 border-ink bg-ink px-5 py-2.5 font-semibold text-paper shadow-[4px_4px_0_var(--green)]"
            >
              {toast.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
