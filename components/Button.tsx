import Link from "next/link";

export function Button({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link href={href} className={`btn ${variant === "primary" ? "btn-primary" : "btn-secondary"}`}>
      {children}
      <span aria-hidden className="btn-arrow">→</span>
    </Link>
  );
}
