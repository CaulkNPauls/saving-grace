"use client";

import { useEffect, useState } from "react";

const DEFAULT_ITEMS_PER_PAGE = 6;

function computeItemsPerPage(): number {
  const { innerWidth: width, innerHeight: height } = window;
  if (height <= 560 || width <= 340) return 2;
  if (height <= 760 || width <= 480) return 4;
  return DEFAULT_ITEMS_PER_PAGE;
}

/**
 * How many flash pieces fit legibly on one book page (always 2 columns; this
 * controls the row count) for the current viewport. Always starts at the
 * desktop default to match the server-rendered HTML — window isn't
 * available server-side — and corrects itself after mount so hydration
 * never mismatches.
 */
export function useFlashItemsPerPage(): number {
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

  useEffect(() => {
    function sync() {
      setItemsPerPage(computeItemsPerPage());
    }
    sync();

    // Mobile browsers fire resize repeatedly while the user pinch-zooms.
    // Rebuilding a page-flip instance in the middle of that gesture can leave
    // its internal page index invalid. Pagination only needs to change when
    // the device orientation changes, not when the visual viewport zooms.
    window.addEventListener("orientationchange", sync);
    return () => window.removeEventListener("orientationchange", sync);
  }, []);

  return itemsPerPage;
}
