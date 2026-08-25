import Image from "next/image";
import type { PortfolioItem } from "@/content/types";

type PortfolioGridProps = {
  items: PortfolioItem[];
};

export default function PortfolioGrid({ items }: PortfolioGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
      {items.map((item) => (
        <div
          key={item.image}
          className="group relative aspect-square overflow-hidden border border-bone/10 bg-charcoal"
        >
          {item.placeholder ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
              <span className="font-display text-[0.65rem] uppercase tracking-widest text-metal">
                Image coming soon
              </span>
              {item.title && (
                <span className="font-serif text-sm italic text-metal/80">{item.title}</span>
              )}
            </div>
          ) : (
            <Image
              src={item.image}
              alt={item.alt}
              fill
              sizes="(min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
      ))}
    </div>
  );
}
