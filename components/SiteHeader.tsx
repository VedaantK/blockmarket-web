"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

/**
 * `children` renders at the start of the nav, e.g. the market's cart button.
 * `tabs` sits in the middle on wider screens and gets its own row on phones.
 */
export function SiteHeader({ children, tabs }: { children?: React.ReactNode; tabs?: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b-2 transition-colors duration-200 ${
        scrolled ? "border-ink bg-paper" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 px-4 sm:grid-cols-[1fr_auto_1fr] sm:px-8">
        <Link href="/" aria-label="Block Market home" className="col-start-1 row-start-1 flex h-16 items-center justify-self-start">
          <Logo />
        </Link>
        {tabs && <div className="col-span-2 row-start-2 flex h-13 items-start sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:h-auto">{tabs}</div>}
        <nav className="col-start-2 row-start-1 flex items-center gap-2 justify-self-end sm:col-start-3 sm:gap-4">
          {children}
          <Link
            href="#"
            className={`rounded-full px-3 py-2 font-semibold whitespace-nowrap hover:bg-ink/5 ${children ? "max-sm:hidden" : ""}`}
          >
            Log in
          </Link>
          <Link href="#" className="btn btn-primary btn-sm">
            Sign up
          </Link>
        </nav>
      </div>
    </header>
  );
}
