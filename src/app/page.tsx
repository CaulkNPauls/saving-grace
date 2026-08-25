import Hero from "@/components/Hero";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import ServiceCard from "@/components/ServiceCard";
import BookingSteps from "@/components/BookingSteps";
import FAQAccordion from "@/components/FAQAccordion";
import CTA from "@/components/CTA";
import Divider from "@/components/Divider";
import { tattoos } from "@/content/tattoos";
import {
  about,
  bookingSteps,
  faqItems,
  publicSecondaryServices,
  servicesSection,
  tattooSection,
} from "@/content/site";
import { hasPublicSecondaryServices } from "@/content/serviceAvailability";

export default function Home() {
  return (
    <>
      <Hero />

      <Section surface="paper">
        <SectionHeading kicker={tattooSection.kicker} heading={tattooSection.heading} tone="ink" />
        <p className="reveal mt-6 max-w-xl font-serif text-lg text-charcoal/85">
          {tattooSection.body}
        </p>
        <div className="mt-10">
          <PortfolioGrid items={tattoos} />
        </div>
        <div className="mt-10">
          <CTA href="/tattoos" variant="outline-ink">
            {tattooSection.cta}
          </CTA>
        </div>
      </Section>

      <div className="border-y border-oxblood-bright/30 bg-ink px-6 py-10 text-center sm:py-12">
        <p className="font-display text-lg uppercase tracking-[0.25em] text-bone sm:text-xl">
          Ready when you are.
        </p>
        <div className="mt-5">
          <CTA href="/booking">Start Your Request</CTA>
        </div>
      </div>

      {hasPublicSecondaryServices && (
        <Section>
          <SectionHeading kicker={servicesSection.kicker} heading={servicesSection.heading} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {publicSecondaryServices.map((serviceItem) => (
              <ServiceCard key={serviceItem.name} {...serviceItem} />
            ))}
          </div>
        </Section>
      )}

      <Section surface="paper">
        <SectionHeading kicker="How It Works" heading="Booking" align="center" tone="ink" />
        <div className="mt-12">
          <BookingSteps steps={bookingSteps} />
        </div>
        <Divider className="text-ink/40" />
        <div className="text-center">
          <CTA href="/booking" variant="outline-ink">
            Start Your Request
          </CTA>
        </div>
      </Section>

      <Section surface="paper-deep">
        <SectionHeading kicker="The Fine Print" heading="Notes From Grace" tone="ink" />
        <div className="mt-10">
          <FAQAccordion items={faqItems} />
        </div>
        <div className="mt-8">
          <CTA href="/faq" variant="outline-ink">
            All Questions
          </CTA>
        </div>
      </Section>

      <Section surface="paper">
        <div className="grid gap-8 sm:grid-cols-[minmax(0,200px)_1fr] sm:items-start sm:gap-10">
          <div className="plate mx-auto w-full max-w-[220px] p-2 sm:mx-0">
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
          </div>
        </div>
      </Section>

      <div className="bg-ink px-6 py-16 text-center sm:py-20">
        <p className="reveal font-display text-2xl uppercase tracking-[0.2em] text-bone sm:text-3xl">
          Let&apos;s make something permanent.
        </p>
        <div className="reveal mt-8">
          <CTA href="/booking">Book With Grace</CTA>
        </div>
      </div>
    </>
  );
}
