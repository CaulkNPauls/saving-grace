"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  // Always starts false to match the server-rendered HTML (window isn't
  // available server-side) — the real value is applied after mount so
  // hydration never mismatches.
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    function sync() {
      setReduced(query.matches);
    }
    query.addEventListener("change", sync);
    sync();
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}
