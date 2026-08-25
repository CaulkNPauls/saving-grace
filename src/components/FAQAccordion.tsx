import type { FAQItem } from "@/content/types";

type FAQAccordionProps = {
  items: FAQItem[];
};

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="divide-y divide-dashed divide-ink/25 border-y-2 border-dashed border-ink/25">
      {items.map((item) => (
        <details key={item.question} className="group reveal py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-base text-ink [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 font-display text-xl leading-none text-oxblood transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-2xl font-serif text-base italic text-charcoal/90">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
