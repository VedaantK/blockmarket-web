export function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="grid grid-cols-2 gap-[3px]" aria-hidden>
        <span className="size-2.5 rounded-[3px] bg-[var(--green)]" />
        <span className="size-2.5 rounded-[3px] bg-[var(--blue)]" />
        <span className="size-2.5 rounded-[3px] bg-[var(--red)]" />
        <span className="size-2.5 rounded-[3px] bg-ink" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight whitespace-nowrap">Block Market</span>
    </span>
  );
}
