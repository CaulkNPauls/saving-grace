import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import CTA from "@/components/CTA";
import AboutGallery from "@/components/AboutGallery";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About — Saving Grace",
  description: "About Grace, the artist behind Saving Grace.",
};

export default function AboutPage() {
  return (
    <Section surface="paper">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading kicker={about.kicker} heading={about.heading} align="center" tone="ink" />
        <div className="mx-auto mt-6 flex max-w-2xl flex-col gap-4 font-serif text-lg text-charcoal/85">
          {about.bio.map((paragraph) => (
            <p key={paragraph} className="reveal">
              {paragraph}
            </p>
          ))}
        </div>
        <p className="reveal mt-6 font-display text-sm uppercase tracking-widest text-oxblood">
          {about.signoff}
        </p>
        <div className="mt-8">
          <CTA href="/booking">Book With Grace</CTA>
        </div>
      </div>
      <div className="mt-12 sm:mt-16">
        <AboutGallery />
      </div>
    </Section>
  );
}
