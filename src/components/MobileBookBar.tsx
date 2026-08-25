"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { bookNav } from "@/content/site";

/**
 * Persistent mobile booking CTA. Hidden on /booking itself, where the page
 * already carries its own primary action and a duplicate bar would just
 * be clutter.
 */
export default function MobileBookBar() {
  const pathname = usePathname();
  if (pathname?.startsWith("/booking")) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 border-t border-oxblood-bright/40 bg-ink/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur supports-[backdrop-filter]:bg-ink/85 md:hidden"
      data-mobile-book-bar
    >
      <Link
        href={bookNav.href}
        className="flex items-center justify-center border border-oxblood-bright bg-oxblood px-5 py-3 font-sans text-sm font-semibold uppercase tracking-wide text-bone transition-colors active:bg-oxblood-bright"
      >
        Book With Grace
      </Link>
    </div>
  );
}
