"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

export function SiteHeader() {
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
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/v2" aria-label="Block Market home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link href="#" className="rounded-full px-3 py-2 font-semibold hover:bg-ink/5">
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
