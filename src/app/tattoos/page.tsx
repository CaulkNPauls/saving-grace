import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import TattoosGallery from "@/components/TattoosGallery";
import CTA from "@/components/CTA";
import { getVisibleTattoos } from "@/lib/data/tattoos";

export const metadata: Metadata = {
  title: "Tattoos — Saving Grace",
  description: "Bold custom tattoos and blackwork by Grace at Saving Grace.",
};

export default async function TattoosPage() {
  const tattoos = await getVisibleTattoos();

  return (
    <Section surface="paper">
      <SectionHeading kicker="The Main Event" heading="Tattoos" tone="ink" />
      <p className="reveal mt-6 max-w-xl font-serif text-lg text-charcoal/85">
        Bold blackwork and custom tattoos, drawn by Grace for the person who will wear them.
        New work will be added here as the portfolio is updated.
      </p>
      <div className="mt-10">
        <TattoosGallery items={tattoos} />
      </div>
      <div className="mt-10">
        <CTA href="/booking">Book With Grace</CTA>
      </div>
    </Section>
  );
}
