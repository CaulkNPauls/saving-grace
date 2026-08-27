"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFlashSelection } from "@/lib/flashSelection";
import type { FlashPublicItem } from "./types";

type FlashPreviewModalProps = {
  item: FlashPublicItem;
  reducedMotion: boolean;
  onClose: () => void;
};

export default function FlashPreviewModal({ item, reducedMotion, onClose }: FlashPreviewModalProps) {
  const { selectedFlash, selectFlash } = useFlashSelection();
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [ripping, setRipping] = useState(false);
  const [confirmReplace, setConfirmReplace] = useState(false);
  const committedRef = useRef(false);

  const alreadyThisOne = selectedFlash?.id === item.id;
  const hasOtherSelection = selectedFlash !== null && !alreadyThisOne;

  useEffect(() => {
    closeRef.current?.focus();
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape" && !ripping) onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose, ripping]);

  function commitSelection() {
    if (committedRef.current) return;
    committedRef.current = true;
    selectFlash({ id: item.id, imageUrl: item.imageUrl, title: item.title });
    router.push("/booking");
    onClose();
  }

  function handleBookThisFlash() {
    if (hasOtherSelection && !confirmReplace) {
      setConfirmReplace(true);
      return;
    }
    if (reducedMotion) {
      commitSelection();
      return;
    }
    setRipping(true);
    // Safety net in case the animationend event never fires.
    setTimeout(commitSelection, 900);
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title ?? "Flash design preview"}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/85 px-4 py-8"
      onClick={() => !ripping && onClose()}
    >
      <div
        className="paper relative w-full max-w-md border border-ink/25 p-6 text-center shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          disabled={ripping}
          aria-label="Close preview"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center border border-ink/30 bg-parchment text-lg text-ink disabled:opacity-40"
        >
          <span aria-hidden="true">&times;</span>
        </button>

        <div
          className={`instant-print plate mx-auto w-full max-w-[280px] ${ripping ? "flash-rip-out" : ""}`}
          onAnimationEnd={() => {
            if (ripping) commitSelection();
          }}
        >
          <div className="instant-print-photo relative aspect-square w-full overflow-hidden bg-charcoal">
            <Image src={item.imageUrl} alt={item.title ?? "Flash design"} fill sizes="280px" className="object-contain" />
          </div>
          <figcaption className="instant-print-caption flex items-center justify-center">
            <span className="font-sans text-xs uppercase tracking-widest text-ink/50">
              Size &amp; Price — Coming Soon
            </span>
          </figcaption>
        </div>

        {!item.available ? (
          <p className="mt-6 font-sans text-sm uppercase tracking-wide text-oxblood">
            This flash has already been claimed.
          </p>
        ) : alreadyThisOne ? (
          <p className="mt-6 font-serif text-base italic text-ink/70">
            This is your selected design for booking.
          </p>
        ) : confirmReplace ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="font-serif text-sm text-ink/80">
              Replace your current selection with this one?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmReplace(false)}
                className="border border-ink/30 px-4 py-2 font-sans text-xs uppercase tracking-wide text-ink/70"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBookThisFlash}
                className="border border-oxblood-bright bg-oxblood px-4 py-2 font-sans text-xs font-semibold uppercase tracking-wide text-bone"
              >
                Replace
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleBookThisFlash}
            disabled={ripping}
            className="mt-6 border border-oxblood-bright bg-oxblood px-6 py-3 font-sans text-sm font-semibold uppercase tracking-wide text-bone hover:bg-oxblood-bright disabled:cursor-wait disabled:opacity-70"
          >
            {ripping ? "…" : "Book This Flash"}
          </button>
        )}
      </div>
    </div>,
    document.body
  );
}
