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
    <Section surface="paper">
      <div className="grid gap-8 sm:grid-cols-[minmax(0,240px)_1fr] sm:items-start sm:gap-10">
        <div className="plate mx-auto w-full max-w-[240px] p-2 sm:mx-0">
          <div className="flex aspect-[3/4] w-full items-center justify-center bg-charcoal p-4 text-center">
            <span className="font-display text-xs uppercase tracking-widest text-metal">
              Portrait coming soon
            </span>
          </div>
        </div>
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
