import type { FAQItem } from "@/content/types";

type FAQAccordionProps = {
  items: FAQItem[];
};

export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="divide-y divide-bone/10 border-y border-bone/10">
      {items.map((item) => (
        <details key={item.question} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-sans text-base text-bone [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 font-display text-xl leading-none text-oxblood-bright transition-transform duration-200 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-4 max-w-2xl font-serif text-base text-parchment/85">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
