import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import CTA from "@/components/CTA";
import { hair } from "@/content/hair";

export const metadata: Metadata = {
  title: "Hair — Saving Grace",
  description: "Hair cutting, coloring, and styling by Grace at Saving Grace.",
};

export default function HairPage() {
  return (
    <Section>
      <SectionHeading kicker="Also By Grace" heading="Hair" />
      <p className="mt-6 max-w-xl font-serif text-lg text-parchment/90">
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
