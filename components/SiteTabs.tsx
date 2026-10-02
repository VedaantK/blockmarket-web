"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Home", href: "/" },
  { label: "Market", href: "/market" },
  { label: "Sell", href: "/sell" },
];

/** Home / Market / Sell switch in the site header. */
export function SiteTabs() {
  const pathname = usePathname();
  // Each section owns everything under its path (vendors, checkout…); Home is just /.
  const active = TABS.slice(1).find((t) => pathname.startsWith(t.href))?.href ?? "/";

  return (
    <nav aria-label="Sections" className="site-tabs flex w-full rounded-full border-2 border-ink bg-surface p-1 font-semibold sm:w-auto">
      {TABS.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={active === t.href ? "page" : undefined}
          className={`flex-1 rounded-full px-4 py-1.5 sm:px-5 text-center transition-colors sm:flex-none ${
            active === t.href ? "bg-ink text-paper" : "hover:bg-ink/5"
          }`}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
