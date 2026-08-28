"use client";

import { useEffect, useId, useRef, useState } from "react";
import { bookNav, primaryNav, site } from "@/content/site";

const mobileNav = [{ label: "Home", href: "/" }, ...primaryNav];

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
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]">
        <div className="flex items-start justify-between border-b border-ink/25 pb-5">
          <div>
            <span className="font-sans text-[0.65rem] uppercase tracking-[0.35em] text-oxblood">Navigation</span>
            <p className="mt-1 font-gothic text-3xl leading-none text-ink">{site.name}</p>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex min-h-11 min-w-11 items-center justify-center border border-ink/35 bg-parchment/70 font-sans text-2xl leading-none text-ink shadow-sm transition-colors active:bg-ink active:text-bone"
          >
            <span aria-hidden="true">&times;</span>
            <span className="sr-only">Close menu</span>
          </button>
        </div>

        <nav className="mt-7 flex flex-1 flex-col" aria-label="Mobile">
          {mobileNav.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className="group flex min-h-16 items-center justify-between border-b border-ink/20 px-1 py-3 first:border-t active:bg-ink/5"
            >
              <span className="font-display text-[1.35rem] uppercase tracking-[0.12em] text-ink">{item.label}</span>
              <span aria-hidden="true" className="flex items-center gap-3 font-sans text-[0.65rem] tracking-widest text-oxblood">
                {String(index + 1).padStart(2, "0")}
                <span className="text-base transition-transform group-hover:translate-x-1">&#8594;</span>
              </span>
            </a>
          ))}
        </nav>

        <div aria-hidden="true" className="my-6 flex items-center gap-3 text-oxblood/60">
          <span className="h-px flex-1 bg-current" />
          <span className="text-xs">&#9670;</span>
          <span className="h-px flex-1 bg-current" />
        </div>

        <a
          href={bookNav.href}
          className="flex min-h-14 items-center justify-center border border-oxblood-bright bg-oxblood px-5 py-4 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-bone shadow-[4px_4px_0_rgba(29,18,11,0.25)] active:translate-x-px active:translate-y-px active:shadow-none"
        >
          {bookNav.label} With Grace
        </a>
        <p className="mt-4 text-center font-serif text-xs italic text-ink/55">Custom tattoos in North Tonawanda, New York</p>
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
