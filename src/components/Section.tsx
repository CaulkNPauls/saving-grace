import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export default function Section({ children, className = "", id }: SectionProps) {
  return (
    <section id={id} className={`mx-auto max-w-6xl px-6 py-20 sm:px-8 lg:py-28 ${className}`}>
      {children}
    </section>
  );
}
