"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const VERSIONS = [
  { label: "V1", href: "/" },
  { label: "V2", href: "/v2" },
  { label: "V3", href: "/v3" },
  { label: "V4", href: "/v4" },
];

export function VersionSwitch() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Page version"
      className="fixed left-4 z-50 flex rounded-full border-2 border-ink bg-surface p-1 text-sm font-semibold shadow-[3px_3px_0_var(--ink)] transition-[bottom] duration-300"
      style={{ bottom: "calc(1rem + var(--cta-offset, 0px))" }}
    >
      {VERSIONS.map((v) => {
        const active = pathname === v.href;
        return (
          <Link
            key={v.href}
            href={v.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1 ${active ? "bg-ink text-paper" : "hover:bg-ink/5"}`}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
