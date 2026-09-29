import Link from "next/link";

const PATHS = [
  {
    title: "For buyers",
    blurb: "Order from campus spots for less than menu price.",
    href: "#",
    color: "var(--green)",
    tilt: "hover:-rotate-1",
  },
  {
    title: "For sellers",
    blurb: "Turn blocks you won't use into cash.",
    href: "#",
    color: "var(--blue)",
    tilt: "hover:rotate-1",
  },
];

function BlockGlyph({ color }: { color: string }) {
  return (
    <span className="grid grid-cols-3 gap-2" aria-hidden>
      {Array.from({ length: 9 }, (_, i) => (
        <span
          key={i}
          className="size-7 rounded-md border-2 border-ink transition-transform duration-300 group-hover:-translate-y-1 motion-reduce:transition-none sm:size-9"
          style={{
            background: i % 4 === 0 ? color : "var(--surface)",
            transitionDelay: `${i * 30}ms`,
          }}
        />
      ))}
    </span>
  );
}

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-8">
      <h2 className="font-display text-[clamp(1.9rem,4vw,3rem)] font-bold leading-tight tracking-tight">How it works</h2>
      <p className="mt-2 text-muted">Pick your side.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {PATHS.map((p) => (
          <Link key={p.title} href={p.href} className={`group card path-card flex flex-col overflow-hidden ${p.tilt}`}>
            <div
              className="grid aspect-[16/10] place-items-center border-b-2 border-ink"
              style={{ background: `color-mix(in srgb, ${p.color} 14%, var(--surface))` }}
            >
              <BlockGlyph color={p.color} />
            </div>
            <div className="flex items-center justify-between gap-4 px-6 py-5">
              <div>
                <h3 className="font-display text-2xl font-bold tracking-tight">{p.title}</h3>
                <p className="mt-1 text-muted">{p.blurb}</p>
              </div>
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink text-lg transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
              >
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
