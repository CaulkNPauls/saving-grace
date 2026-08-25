import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import CTA from "@/components/CTA";
import { hair } from "@/content/hair";
import { serviceAvailability } from "@/content/serviceAvailability";

export const metadata: Metadata = {
  title: "Hair — Saving Grace",
  description: "Hair cutting, coloring, and styling by Grace at Saving Grace.",
};

export default function HairPage() {
  if (!serviceAvailability.hair) notFound();

  return (
    <Section surface="paper">
      <SectionHeading kicker="Also By Grace" heading="Hair" tone="ink" />
      <p className="reveal mt-6 max-w-xl font-serif text-lg text-charcoal/85">
        Cutting, coloring, and styling — a second craft, practiced with the same care as the
        first. A full portfolio is coming soon.
      </p>
      <div className="mt-10">
        <PortfolioGrid items={hair} />
      </div>
      <div className="mt-10">
        <CTA href="/booking">Book With Grace</CTA>
      </div>
    </Section>
  );
}
