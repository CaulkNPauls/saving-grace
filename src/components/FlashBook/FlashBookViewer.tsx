"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import { useFlashItemsPerPage } from "@/lib/useFlashItemsPerPage";
import { useFlashSelection } from "@/lib/flashSelection";
import FlashPreviewModal from "./FlashPreviewModal";
import type { FlashPublicItem } from "./types";

function chunk<T>(list: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}

const HTMLFlipBook = dynamic(() => import("react-pageflip").then((mod) => mod.default), {
  ssr: false,
});

interface FlipController {
  flip(point: { x: number; y: number }): void;
}

interface PageFlipInstance {
  turnToPage(page: number): void;
  getCurrentPageIndex(): number;
  getBoundsRect(): { left: number; top: number; width: number; height: number; pageWidth: number };
  getFlipController(): FlipController;
}

type FlipEvent = { data: number };

export default function FlashBookViewer({ items }: { items: FlashPublicItem[] }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const itemsPerPage = useFlashItemsPerPage();
  const bookRef = useRef<{ pageFlip: () => PageFlipInstance }>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [previewItem, setPreviewItem] = useState<FlashPublicItem | null>(null);
  const pages = useMemo(() => chunk(items, itemsPerPage), [items, itemsPerPage]);
  const pageRows = itemsPerPage / 2;
  const totalLeaves = pages.length + 2; // cover + content pages + closing page
  const isOpen = currentPage > 0;

  // Re-pagination (e.g. rotating the phone, resizing a window) changes how
  // many leaves exist, which can strand the current page index — snap back
  // to the closed cover whenever the item count per page actually changes.
  const prevItemsPerPageRef = useRef(itemsPerPage);
  useEffect(() => {
    if (prevItemsPerPageRef.current === itemsPerPage) return;
    prevItemsPerPageRef.current = itemsPerPage;
    setCurrentPage(0);
    bookRef.current?.pageFlip().turnToPage(0);
  }, [itemsPerPage]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        flipToward("next");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        flipToward("prev");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // react-pageflip's flipNext()/flipPrev() compute their target point assuming
  // a two-page spread (pageWidth * 2), which lands outside the single visible
  // page's bounds once the book is forced into single-page mode — and with
  // disableFlipByClick on, any point outside those bounds is silently
  // rejected. Driving the flip controller directly with a point that's
  // actually within this page's bounds sidesteps that bug entirely.
  function flipToward(direction: "next" | "prev") {
    const instance = bookRef.current?.pageFlip();
    if (!instance) return;
    const rect = instance.getBoundsRect();
    // getBoundsRect() describes the full two-page "block", not just the
    // single visible page — in forced single-page mode the visible page
    // occupies only the right-hand half of that block. Target a corner
    // point that actually falls within it (right edge of the block for
    // "next"; left edge of the visible page, i.e. the block's midpoint,
    // for "prev"), or the click gets silently rejected as off-page.
    const point =
      direction === "next"
        ? { x: rect.left + rect.width - 1, y: rect.top + 1 }
        : { x: rect.left + 1, y: rect.top + 1 };
    instance.getFlipController().flip(point);
  }

  function openBook() {
    flipToward("next");
  }

  function closeBook() {
    bookRef.current?.pageFlip().turnToPage(0);
  }

  function goNext() {
    flipToward("next");
  }

  function goPrev() {
    flipToward("prev");
  }

  if (prefersReducedMotion) {
    return <FlashBookFallback pages={pages} />;
  }

  return (
    <div className="flash-book-shell">
      <div className="w-full">
        <HTMLFlipBook
          ref={bookRef}
          className="flash-flipbook"
          style={{}}
          startPage={0}
          size="stretch"
          width={440}
          height={820}
          minWidth={160}
          maxWidth={480}
          minHeight={298}
          maxHeight={894}
          drawShadow
          flippingTime={700}
          usePortrait={false}
          startZIndex={0}
          autoSize
          maxShadowOpacity={0.4}
          showCover
          mobileScrollSupport={false}
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick
          onFlip={(event: FlipEvent) => setCurrentPage(event.data)}
        >
          <div
            className="flash-cover"
            role="button"
            tabIndex={0}
            aria-label="Open the Saving Grace flash book"
            onClick={(event) => {
              event.stopPropagation();
              openBook();
            }}
            onPointerUp={(event) => {
              if (event.pointerType === "touch") {
                event.stopPropagation();
                openBook();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openBook();
              }
            }}
          >
            <div className="flash-cover-content">
              <span className="flash-cover-eyebrow">Saving Grace</span>
              <span className="flash-cover-title">Flash</span>
              <span className="flash-cover-hint">Tap to open</span>
            </div>
          </div>

          {pages.map((pageItems, pageIndex) => (
            <div key={pageIndex} className="flash-page-surface">
              <div
                className="flash-page-inner"
                style={{ "--flash-page-rows": pageRows } as CSSProperties}
              >
                {pageItems.map((item) => (
                  <FlashPiece key={item.id} item={item} onSelect={() => setPreviewItem(item)} />
                ))}
              </div>
            </div>
          ))}

          <div
            className="flash-cover"
            role="button"
            tabIndex={0}
            aria-label="Close the Saving Grace flash book"
            onClick={(event) => {
              event.stopPropagation();
              closeBook();
            }}
            onPointerUp={(event) => {
              if (event.pointerType === "touch") {
                event.stopPropagation();
                closeBook();
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                closeBook();
              }
            }}
          >
            <div className="flash-cover-content">
              <span className="flash-cover-eyebrow">Saving Grace</span>
              <span className="flash-cover-hint">That&apos;s all for now — tap to close</span>
            </div>
          </div>
        </HTMLFlipBook>
      </div>

      {isOpen && (
        <div className="mt-5 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentPage === 0}
            className="border border-ink/30 bg-parchment px-4 py-2 font-sans text-xs uppercase tracking-wide text-ink/80 hover:bg-ink/10 disabled:opacity-30"
          >
            ‹ Prev
          </button>
          <button
            type="button"
            onClick={closeBook}
            className="border border-oxblood-bright bg-oxblood px-4 py-2 font-sans text-xs uppercase tracking-wide text-bone hover:bg-oxblood-bright"
          >
            Close Book
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={currentPage >= totalLeaves - 1}
            className="border border-ink/30 bg-parchment px-4 py-2 font-sans text-xs uppercase tracking-wide text-ink/80 hover:bg-ink/10 disabled:opacity-30"
          >
            Next ›
          </button>
        </div>
      )}

      {previewItem && (
        <FlashPreviewModal item={previewItem} reducedMotion={false} onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
}

function FlashPiece({ item, onSelect }: { item: FlashPublicItem; onSelect: () => void }) {
  const { selectedFlash } = useFlashSelection();
  const isTornOut = selectedFlash?.id === item.id;

  if (isTornOut) {
    return (
      <div className="flash-piece-gap" aria-label={`${item.title ?? "This design"} is set aside for your booking request`}>
        Set aside for your request
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerUp={(event) => {
        // page-flip's own touch handling swallows the synthetic "click" that
        // would normally follow a tap on nested content, so handle touch here.
        if (event.pointerType === "touch") {
          event.stopPropagation();
          onSelect();
        }
      }}
      className="flash-piece-button"
      aria-label={item.available ? `View ${item.title ?? "this flash design"}` : `${item.title ?? "This flash design"} — claimed`}
    >
      <figure className={`plate instant-print reveal ${item.available ? "" : "flash-piece-unavailable"}`}>
        <div className="instant-print-photo relative overflow-hidden bg-charcoal">
          <Image
            src={item.imageUrl}
            alt={item.title ?? "Flash design"}
            fill
            sizes="(min-width: 640px) 200px, 45vw"
            className="object-contain p-1"
          />
        </div>
        <figcaption className="instant-print-caption flex items-center justify-center">
          <span className="font-sans text-[0.6rem] uppercase tracking-widest text-ink/50">
            Size &amp; Price — Soon
          </span>
        </figcaption>
      </figure>
    </button>
  );
}

function FlashBookFallback({ pages }: { pages: FlashPublicItem[][] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [previewItem, setPreviewItem] = useState<FlashPublicItem | null>(null);
  const page = pages[index];

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setIndex((value) => Math.min(pages.length - 1, value + 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setIndex((value) => Math.max(0, value - 1));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, pages.length]);

  if (!open) {
    return (
      <div className="flash-book-shell">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flash-cover flex items-center justify-center"
        >
          <div className="flash-cover-content">
            <span className="flash-cover-eyebrow">Saving Grace</span>
            <span className="flash-cover-title">Flash</span>
            <span className="flash-cover-hint">Open Flash Book</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="flash-book-shell">
      <div className="paper mx-auto max-w-xl border border-ink/20 p-5">
        <div className="flash-book-fallback-page">
          {page.map((item) => (
            <FlashPiece key={item.id} item={item} onSelect={() => setPreviewItem(item)} />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIndex((value) => Math.max(0, value - 1))}
            disabled={index === 0}
            className="border border-ink/30 px-4 py-2 font-sans text-xs uppercase tracking-wide text-ink/70 disabled:opacity-30"
          >
            ‹ Prev
          </button>
          <span className="font-serif text-sm italic text-ink/70">
            Page {index + 1} of {pages.length}
          </span>
          <button
            type="button"
            onClick={() => setIndex((value) => Math.min(pages.length - 1, value + 1))}
            disabled={index === pages.length - 1}
            className="border border-ink/30 px-4 py-2 font-sans text-xs uppercase tracking-wide text-ink/70 disabled:opacity-30"
          >
            Next ›
          </button>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-4 w-full border border-oxblood/40 px-4 py-2 font-sans text-xs uppercase tracking-wide text-oxblood hover:bg-oxblood/10"
        >
          Close Book
        </button>
      </div>

      {previewItem && (
        <FlashPreviewModal item={previewItem} reducedMotion onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
}
