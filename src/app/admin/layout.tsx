import type { Metadata } from "next";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
  title: "Admin — Saving Grace",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-charcoal">
      <header className="flex items-center justify-between border-b border-bone/15 bg-ink px-4 py-4 sm:px-8">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-sm uppercase tracking-[0.2em] text-bone">Saving Grace</span>
          <span className="font-sans text-xs uppercase tracking-wide text-oxblood-bright">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="font-sans text-xs uppercase tracking-wide text-bone/70 hover:text-bone">
            View Site
          </Link>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-8">{children}</main>
    </div>
  );
}
