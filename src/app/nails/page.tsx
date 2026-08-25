import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import CTA from "@/components/CTA";
import { nails } from "@/content/nails";
import { serviceAvailability } from "@/content/serviceAvailability";

export const metadata: Metadata = {
  title: "Nails — Saving Grace",
  description: "Nail services by Grace at Saving Grace.",
};

export default function NailsPage() {
  if (!serviceAvailability.nails) notFound();

  return (
    <Section surface="paper">
      <SectionHeading kicker="Also By Grace" heading="Nails" tone="ink" />
      <p className="reveal mt-6 max-w-xl font-serif text-lg text-charcoal/85">
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
