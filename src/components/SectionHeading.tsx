type SectionHeadingProps = {
  kicker?: string;
  heading: string;
  align?: "left" | "center";
  className?: string;
};

export default function SectionHeading({
  kicker,
  heading,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const isCentered = align === "center";

  return (
    <div className={`${isCentered ? "text-center" : "text-left"} ${className}`}>
      {kicker && (
        <p className="mb-2 font-sans text-xs uppercase tracking-[0.3em] text-oxblood-bright">
          {kicker}
        </p>
      )}
      <h2 className="font-display text-4xl uppercase tracking-wide text-bone sm:text-5xl">
        {heading}
      </h2>
      <div
        className={`ornament-rule mt-6 w-16 text-metal ${isCentered ? "mx-auto" : ""}`}
        aria-hidden="true"
      />
    </div>
  );
}
