import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import CTA from "@/components/CTA";
import { about } from "@/content/site";

export const metadata: Metadata = {
  title: "About — Saving Grace",
  description: "About Grace, the artist behind Saving Grace.",
};

export default function AboutPage() {
  return (
    <Section>
      <div className="grid gap-10 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-start">
        <div className="aspect-[3/4] w-full max-w-[260px] border border-bone/10 bg-charcoal">
          <div className="flex h-full w-full items-center justify-center p-4 text-center">
            <span className="font-display text-xs uppercase tracking-widest text-metal">
              Portrait coming soon
            </span>
          </div>
        </div>
        <div>
          <SectionHeading kicker={about.kicker} heading={about.heading} />
          <div className="mt-6 flex max-w-xl flex-col gap-4 font-serif text-lg text-parchment/90">
            {about.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-6 font-display text-sm uppercase tracking-widest text-oxblood-bright">
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
