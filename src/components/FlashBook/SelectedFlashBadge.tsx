"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFlashSelection } from "@/lib/flashSelection";

/** Persistent site-wide indicator once a visitor has picked a flash design to book. */
export default function SelectedFlashBadge() {
  const { selectedFlash, clearFlash } = useFlashSelection();
  const pathname = usePathname();

  if (!selectedFlash || pathname?.startsWith("/booking")) return null;

  return (
    <div className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] left-3 z-40 flex items-center gap-3 border border-oxblood-bright bg-ink/95 py-2 pl-2 pr-3 shadow-lg backdrop-blur sm:bottom-4">
      <div className="relative h-11 w-11 shrink-0 overflow-hidden border border-bone/20 bg-charcoal">
        <Image src={selectedFlash.imageUrl} alt={selectedFlash.title ?? "Selected flash"} fill sizes="44px" className="object-cover" />
      </div>
      <div className="flex flex-col">
        <span className="font-sans text-[0.6rem] uppercase tracking-widest text-oxblood-bright">Selected Flash</span>
        <Link href="/booking" className="font-serif text-sm italic text-bone hover:underline">
          {selectedFlash.title ?? "Book this design"}
        </Link>
      </div>
      <button
        type="button"
        onClick={clearFlash}
        aria-label="Remove selected flash"
        className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center border border-bone/30 text-bone/70 hover:bg-bone/10"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  );
}
