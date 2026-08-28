import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import TattoosGallery from "@/components/TattoosGallery";
import CTA from "@/components/CTA";
import FlashBookSection from "@/components/FlashBook/FlashBookSection";
import { getVisibleTattoos } from "@/lib/data/tattoos";

export const metadata: Metadata = {
  title: "Tattoos — Saving Grace",
  description: "Bold custom tattoos and blackwork by Grace at Saving Grace.",
};

// Reads admin-editable content from the database on every request — must not
// be statically generated at build time (Vercel's build step has no reliable
// path to the DB, unlike a running server function).
export const dynamic = "force-dynamic";

export default async function TattoosPage() {
  const tattoos = await getVisibleTattoos();

  return (
    <>
      <Section surface="paper">
        <SectionHeading kicker="The Main Event" heading="Tattoos" tone="ink" />
        <p className="reveal mt-6 max-w-xl font-serif text-lg text-charcoal/85">
          Bold blackwork and custom tattoos, drawn by Grace for the person who will wear them.
          New work will be added here as the portfolio is updated.
        </p>
        <div className="mt-10">
          <TattoosGallery items={tattoos} />
        </div>
      </Section>

      <FlashBookSection />

      <div className="border-y border-oxblood-bright/30 bg-ink px-6 py-10 text-center sm:py-12">
        <p className="font-display text-lg uppercase tracking-[0.25em] text-bone sm:text-xl">
          Ready when you are.
        </p>
        <div className="mt-5">
          <CTA href="/booking">Book With Grace</CTA>
        </div>
      </div>
    </>
  );
}
