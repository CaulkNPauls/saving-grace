type SectionHeadingProps = {
  kicker?: string;
  heading: string;
  align?: "left" | "center";
  /** "bone" for dark ink sections (default), "ink" for paper sections. */
  tone?: "bone" | "ink";
  className?: string;
};

export default function SectionHeading({
  kicker,
  heading,
  align = "left",
  tone = "bone",
  className = "",
}: SectionHeadingProps) {
  const isCentered = align === "center";
  const headingColor = tone === "ink" ? "text-ink" : "text-bone";
  const ruleColor = tone === "ink" ? "text-ink/50" : "text-metal";
  const kickerColor = tone === "ink" ? "text-oxblood" : "text-oxblood-bright";

  return (
    <div className={`reveal ${isCentered ? "text-center" : "text-left"} ${className}`}>
      {kicker && (
        <p className={`mb-2 font-sans text-xs uppercase tracking-[0.3em] ${kickerColor}`}>
          {kicker}
        </p>
      )}
      <h2
        className={`font-display text-3xl uppercase tracking-wide sm:text-4xl lg:text-5xl ${headingColor}`}
      >
        {heading}
      </h2>
      <div
        className={`ornament-rule mt-5 w-14 sm:mt-6 sm:w-16 ${ruleColor} ${isCentered ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
