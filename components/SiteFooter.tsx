import Link from "next/link";
import { Logo } from "./Logo";

const LINKS = [
  { label: "FAQ", href: "#faq" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Contact", href: "#" },
];

export function SiteFooter() {
  return (
    <footer id="site-footer" className="border-t-2 border-ink bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 text-muted">Built by CMU students, for CMU students.</p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-semibold">
            {LINKS.map((l) => (
              <li key={l.label}>
                <Link href={l.href} className="underline-offset-4 hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-24 text-sm text-muted sm:px-8 sm:pb-10">© 2026 Block Market</div>
    </footer>
  );
}
