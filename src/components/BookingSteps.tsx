import type { BookingStep } from "@/content/types";

type BookingStepsProps = {
  steps: BookingStep[];
};

export default function BookingSteps({ steps }: BookingStepsProps) {
  return (
    <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step) => (
        <li key={step.number} className="reveal border-t border-oxblood/50 pt-6">
          <span className="font-display text-sm text-oxblood">{step.number}</span>
          <h3 className="mt-2 font-display text-lg uppercase tracking-wide text-ink sm:text-xl">
            {step.title}
          </h3>
          <p className="mt-3 font-serif text-base text-charcoal/85">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
