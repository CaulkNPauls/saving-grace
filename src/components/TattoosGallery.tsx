"use client";

import { useState } from "react";
import PortfolioGrid from "@/components/PortfolioGrid";
import type { PortfolioItem } from "@/content/types";

type TattoosGalleryProps = {
  items: PortfolioItem[];
};

export default function TattoosGallery({ items }: TattoosGalleryProps) {
  const [tab, setTab] = useState<"featured" | "all">("featured");
  const featured = items.filter((item) => item.featured);
  const visible = tab === "featured" ? featured : items;

  return (
    <div>
      <div className="reveal flex gap-6 border-b-2 border-dashed border-ink/25">
        {(
          [
            { key: "featured", label: "Featured" },
            { key: "all", label: "All Work" },
          ] as const
        ).map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setTab(option.key)}
            aria-pressed={tab === option.key}
            className={`-mb-0.5 border-b-2 pb-3 font-display text-sm uppercase tracking-widest transition-colors ${
              tab === option.key
                ? "border-oxblood text-oxblood"
                : "border-transparent text-ink/40 hover:text-ink/70"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <div className="mt-10">
        <PortfolioGrid items={visible} />
      </div>
    </div>
  );
}
