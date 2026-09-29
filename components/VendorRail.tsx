"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { matchesQuery, PLACEHOLDER_COUNT, VENDORS } from "@/lib/vendors";

const ACCENTS = ["var(--green)", "var(--blue)", "var(--red)"];

function Arrow({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Scroll left" : "Scroll right"}
      className="icon-btn"
    >
      <span aria-hidden>{dir === "left" ? "←" : "→"}</span>
    </button>
  );
}

export function VendorRail() {
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [edges, setEdges] = useState({ start: true, end: false });

  const results = VENDORS.filter((v) => matchesQuery(v, query));
  const searching = query.trim() !== "";

  const updateEdges = () => {
    const el = railRef.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  };

  useEffect(() => {
    const el = railRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Results change the rail's width; jump back to the start so matches are visible.
  useEffect(() => {
    railRef.current?.scrollTo({ left: 0 });
    updateEdges();
  }, [query]);

  // "/" focuses the search, like most sites with a search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollByPage = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section className="py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tight">
            Places you can eat from
          </h2>
          <p className="mt-2 max-w-md text-muted">Order from any of these and a student with spare blocks picks up the tab.</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="search flex-1 md:w-72 md:flex-none">
            <span className="sr-only">Search places to eat</span>
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
              placeholder="Search spots or food"
              className="w-full bg-transparent outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
            />
            {searching ? (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="text-sm font-medium text-muted hover:text-ink">
                Clear
              </button>
            ) : (
              <kbd className="hidden rounded-md border border-ink/20 px-1.5 text-xs text-muted md:inline">/</kbd>
            )}
          </label>
          <div className="hidden gap-2 sm:flex">
            <Arrow dir="left" disabled={edges.start} onClick={() => scrollByPage(-1)} />
            <Arrow dir="right" disabled={edges.end} onClick={() => scrollByPage(1)} />
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {searching ? `${results.length} ${results.length === 1 ? "place matches" : "places match"} ${query}` : ""}
      </p>

      <div
        ref={railRef}
        onScroll={updateEdges}
        className="rail mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pt-2 pb-6"
        tabIndex={0}
        aria-label="Places you can eat from"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {results.map((v) => (
            <motion.article
              key={v.id}
              layout={!reduce}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="vendor-card group card w-64 shrink-0 snap-start overflow-hidden sm:w-72"
            >
              <div className="relative aspect-[4/5] overflow-hidden border-b-2 border-ink">
                <Image
                  src={v.image}
                  alt={`Food from ${v.name}`}
                  fill
                  sizes="(min-width: 640px) 288px, 256px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                />
                <span
                  className="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-on-color"
                  style={{ background: ACCENTS[VENDORS.indexOf(v) % ACCENTS.length] }}
                >
                  {v.cuisine}
                </span>
              </div>
              <div className="px-5 py-4">
                <h3 className="font-display text-xl font-bold tracking-tight">{v.name}</h3>
                <p className="mt-0.5 text-sm text-muted">Takes blocks</p>
              </div>
            </motion.article>
          ))}

          {!searching &&
            Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
              <motion.div
                key={`placeholder-${i}`}
                layout={!reduce}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="placeholder-card flex w-64 shrink-0 snap-start flex-col justify-end sm:w-72"
                aria-hidden
              >
                <div className="aspect-[4/5]" />
                <div className="px-5 py-4">
                  <p className="font-display text-xl font-bold tracking-tight text-muted">More spots soon</p>
                  <p className="mt-0.5 text-sm text-transparent">&nbsp;</p>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        {searching && results.length === 0 && (
          <div className="flex min-h-48 w-full flex-col items-start justify-center gap-2">
            <p className="font-display text-2xl font-bold">Nothing matches &ldquo;{query.trim()}&rdquo;</p>
            <p className="text-muted">Try a food instead, like pizza or bagel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
