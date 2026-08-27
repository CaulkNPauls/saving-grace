"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type SelectedFlash = {
  id: number;
  imageUrl: string;
  title: string | null;
};

const STORAGE_KEY = "sg_selected_flash";

type FlashSelectionContextValue = {
  selectedFlash: SelectedFlash | null;
  selectFlash: (flash: SelectedFlash) => void;
  clearFlash: () => void;
};

const FlashSelectionContext = createContext<FlashSelectionContextValue | null>(null);

function readStoredFlash(): SelectedFlash | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SelectedFlash) : null;
  } catch {
    return null;
  }
}

export function FlashSelectionProvider({ children }: { children: React.ReactNode }) {
  const [selectedFlash, setSelectedFlash] = useState<SelectedFlash | null>(null);

  // Session-scoped only: hydrate from sessionStorage after mount (never
  // during SSR) and stay in sync if another tab in this session changes it.
  useEffect(() => {
    function sync() {
      setSelectedFlash(readStoredFlash());
    }
    window.addEventListener("storage", sync);
    sync();
    return () => window.removeEventListener("storage", sync);
  }, []);

  const selectFlash = useCallback((flash: SelectedFlash) => {
    setSelectedFlash(flash);
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(flash));
    } catch {
      // storage unavailable (private mode etc.) — selection still works for this render
    }
  }, []);

  const clearFlash = useCallback(() => {
    setSelectedFlash(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return (
    <FlashSelectionContext.Provider value={{ selectedFlash, selectFlash, clearFlash }}>
      {children}
    </FlashSelectionContext.Provider>
  );
}

export function useFlashSelection(): FlashSelectionContextValue {
  const ctx = useContext(FlashSelectionContext);
  if (!ctx) {
    throw new Error("useFlashSelection must be used within FlashSelectionProvider");
  }
  return ctx;
}
