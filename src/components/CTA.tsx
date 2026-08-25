import Link from "next/link";
import type { ReactNode } from "react";

type CTAProps = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
};

export default function CTA({ href, children, variant = "solid", className = "" }: CTAProps) {
  const base =
    "inline-flex items-center justify-center gap-2 px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wide transition-colors";
  const styles =
    variant === "solid"
      ? "border border-oxblood-bright bg-oxblood text-bone hover:bg-oxblood-bright"
      : "border border-bone/30 text-bone hover:border-oxblood-bright hover:text-oxblood-bright";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
