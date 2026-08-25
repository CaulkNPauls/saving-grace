import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** "paper"/"paper-deep" apply the aged-parchment surface full-bleed. */
  surface?: "paper" | "paper-deep";
};

export default function Section({ children, className = "", id, surface }: SectionProps) {
  const surfaceClass =
    surface === "paper" ? "paper" : surface === "paper-deep" ? "paper paper-deep" : "";

  return (
    <section id={id} className={surfaceClass}>
      <div className={`mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:py-28 ${className}`}>
        {children}
      </div>
    </section>
  );
}
