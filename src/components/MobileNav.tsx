"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { bookNav, primaryNav, site } from "@/content/site";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    document.body.dataset.mobileMenuOpen = "true";
    closeRef.current?.focus();

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;

      const panel = document.getElementById(panelId);
      const focusable = panel?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      delete document.body.dataset.mobileMenuOpen;
      trigger?.focus();
    };
  }, [open, panelId]);

  const menu = open ? (
    <div
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="mobile-nav-panel paper fixed inset-0 z-[100] flex min-h-svh flex-col overflow-y-auto overscroll-contain"
    >
      <div className="flex min-h-full flex-1 flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between border-b border-ink/25 pb-4">
          <span className="font-display text-sm uppercase tracking-[0.2em] text-ink">{site.name}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="flex min-h-11 min-w-11 items-center justify-center border border-ink/40 bg-parchment font-sans text-2xl leading-none text-ink"
          >
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col" aria-label="Mobile">
          {primaryNav.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-14 items-center justify-between border-b border-ink/20 py-3 font-display text-2xl uppercase tracking-wide text-ink first:border-t"
            >
              {item.label}
              <span aria-hidden="true" className="font-sans text-xs text-oxblood">
                {String(index + 1).padStart(2, "0")}
              </span>
            </Link>
          ))}
        </nav>

        <Link
          href={bookNav.href}
          onClick={() => setOpen(false)}
          className="mt-8 flex min-h-12 items-center justify-center border border-oxblood bg-oxblood px-5 py-4 font-sans text-base font-semibold uppercase tracking-wide text-bone"
        >
          {bookNav.label} With Grace
        </Link>
      </div>
    </div>
  ) : null;

  return (
    <div className="relative z-50 md:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close menu" : "Open menu"}
        className="relative z-50 flex h-11 w-11 touch-manipulation flex-col items-center justify-center gap-1.5 border border-bone/35 bg-ink"
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
      {menu}
    </div>
  );
}
