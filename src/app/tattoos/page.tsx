import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import CTA from "@/components/CTA";
import { tattoos } from "@/content/tattoos";

export const metadata: Metadata = {
  title: "Tattoos — Saving Grace",
  description: "Custom blackwork and fine-line tattoos by Grace at Saving Grace.",
};

export default function TattoosPage() {
  return (
    <Section surface="paper">
      <SectionHeading kicker="The Main Event" heading="Tattoos" tone="ink" />
      <p className="reveal mt-6 max-w-xl font-serif text-lg text-charcoal/85">
        The full tattoo gallery is coming soon. In the meantime, here&apos;s a preview of what to
        expect — custom blackwork and fine-line pieces, designed by Grace.
      </p>
      <div className="mt-10">
        <PortfolioGrid items={tattoos} />
      </div>
      <div className="mt-10">
        <CTA href="/booking">Book With Grace</CTA>
      </div>
    </Section>
  );
}
