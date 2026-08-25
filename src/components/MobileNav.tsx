"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { bookNav, primaryNav, site } from "@/content/site";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 border border-bone/25"
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <span
          aria-hidden="true"
          className={`block h-px w-5 bg-bone transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`}
        />
        <span
          aria-hidden="true"
          className={`block h-px w-5 bg-bone transition-opacity ${open ? "opacity-0" : "opacity-100"}`}
        />
        <span
          aria-hidden="true"
          className={`block h-px w-5 bg-bone transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`}
        />
      </button>

      <div
        id={panelId}
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink px-6 pb-10 pt-24"
      >
        <nav className="flex flex-1 flex-col gap-6" aria-label="Mobile">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display text-2xl uppercase tracking-wide text-bone"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href={bookNav.href}
          onClick={() => setOpen(false)}
          className="mt-8 flex items-center justify-center border border-oxblood-bright bg-oxblood px-5 py-4 font-sans text-base font-semibold uppercase tracking-wide text-bone"
        >
          {bookNav.label}
        </Link>

        <p className="mt-6 text-center text-xs uppercase tracking-widest text-metal">
          {site.name}
        </p>
      </div>
    </div>
  );
}
