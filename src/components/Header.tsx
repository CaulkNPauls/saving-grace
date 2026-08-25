import Link from "next/link";
import { bookNav, primaryNav, site } from "@/content/site";
import MobileNav from "./MobileNav";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-bone/15 bg-ink">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          aria-label="Saving Grace — Home"
          className="brand-mark"
        >
          {site.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative font-sans text-sm uppercase tracking-wide text-bone/80 transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-oxblood-bright after:transition-all hover:text-bone hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href={bookNav.href}
            className="inline-flex items-center border border-oxblood-bright bg-oxblood px-5 py-2 font-sans text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-oxblood-bright"
          >
            {bookNav.label}
          </Link>
        </div>

        <MobileNav />
      </div>
    </header>
  );
}
