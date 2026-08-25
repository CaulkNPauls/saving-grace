import Image from "next/image";
import type { PortfolioItem } from "@/content/types";

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {items.map((item, index) => (
        <figure key={item.image} className="plate instant-print reveal">
          <div className="instant-print-photo relative aspect-[3/4] overflow-hidden bg-charcoal">
            {item.placeholder ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <span className="font-display text-[0.65rem] uppercase tracking-widest text-metal">
                  Image coming soon
                </span>
              </div>
            ) : (
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            )}
          </div>
          <figcaption className="instant-print-caption flex items-baseline justify-between gap-3">
            <span className="font-serif text-sm italic text-ink/80">
              {item.title ?? "Untitled piece"}
            </span>
            <span className="shrink-0 font-sans text-[0.65rem] uppercase tracking-widest text-ink/40">
              Plate {String(index + 1).padStart(2, "0")}
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
