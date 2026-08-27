import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import CTA from "@/components/CTA";
import ArtistPortrait from "@/components/ArtistPortrait";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About — Saving Grace",
  description: "About Grace, the artist behind Saving Grace.",
};

export default function AboutPage() {
  return (
    <Section surface="paper">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,200px)_1fr] sm:items-start sm:gap-10">
        <ArtistPortrait />
        <div>
          <SectionHeading kicker={about.kicker} heading={about.heading} tone="ink" />
          <div className="mt-6 flex max-w-xl flex-col gap-4 font-serif text-lg text-charcoal/85">
            {about.bio.map((paragraph) => (
              <p key={paragraph} className="reveal">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="reveal mt-6 font-display text-sm uppercase tracking-widest text-oxblood">
            {about.signoff}
          </p>
          <div className="mt-10">
            <CTA href="/booking">Book With Grace</CTA>
          </div>
        </div>
      </div>
    </Section>
  );
}
