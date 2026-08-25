import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import CTA from "@/components/CTA";
import { nails } from "@/content/nails";

export const metadata: Metadata = {
  title: "Nails — Saving Grace",
  description: "Nail services by Grace at Saving Grace.",
};

export default function NailsPage() {
  return (
    <Section>
      <SectionHeading kicker="Also By Grace" heading="Nails" />
      <p className="mt-6 max-w-xl font-serif text-lg text-parchment/90">
        Clean, considered nail work for clients who already trust Grace with everything else. A
        full portfolio is coming soon.
      </p>
      <div className="mt-10">
        <PortfolioGrid items={nails} />
      </div>
      <div className="mt-10">
        <CTA href="/booking">Book With Grace</CTA>
      </div>
    </Section>
  );
}
