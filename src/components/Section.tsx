import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Paper variants adjust the shared document tone without creating cards. */
  surface?: "paper" | "paper-deep";
};

export default function Section({ children, className = "", id, surface }: SectionProps) {
  const surfaceClass = surface === "paper-deep" ? "paper paper-deep" : surface === "paper" ? "paper" : "ink-panel";

  return (
    <section id={id} className={surfaceClass}>
      <div className={`mx-auto max-w-6xl px-4 py-14 sm:px-8 sm:py-20 lg:py-28 ${className}`}>
        {children}
      </div>
    </section>
  );
}
