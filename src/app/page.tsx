import Hero from "@/components/Hero";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import PortfolioGrid from "@/components/PortfolioGrid";
import ServiceCard from "@/components/ServiceCard";
import BookingSteps from "@/components/BookingSteps";
import FAQAccordion from "@/components/FAQAccordion";
import CTA from "@/components/CTA";
import { tattoos } from "@/content/tattoos";
import { about, bookingSteps, faqItems, servicesSection, tattooSection } from "@/content/site";

export default function Home() {
  return (
    <>
      <Hero />

      <Section className="border-b border-bone/10">
        <SectionHeading kicker={tattooSection.kicker} heading={tattooSection.heading} />
        <p className="mt-6 max-w-xl font-serif text-lg text-parchment/90">{tattooSection.body}</p>
        <div className="mt-10">
          <PortfolioGrid items={tattoos} />
        </div>
        <div className="mt-10">
          <CTA href="/tattoos" variant="outline">
            {tattooSection.cta}
          </CTA>
        </div>
      </Section>

      <Section className="border-b border-bone/10">
        <SectionHeading kicker={servicesSection.kicker} heading={servicesSection.heading} />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {servicesSection.services.map((serviceItem) => (
            <ServiceCard key={serviceItem.name} {...serviceItem} />
          ))}
        </div>
      </Section>

      <Section className="border-b border-bone/10">
        <SectionHeading kicker="How It Works" heading="Booking" align="center" />
        <div className="mt-12">
          <BookingSteps steps={bookingSteps} />
        </div>
        <div className="mt-12 text-center">
          <CTA href="/booking">Start Your Request</CTA>
        </div>
      </Section>

      <Section className="border-b border-bone/10">
        <SectionHeading kicker="Good To Know" heading="FAQ" />
        <div className="mt-10">
          <FAQAccordion items={faqItems} />
        </div>
        <div className="mt-8">
          <CTA href="/faq" variant="outline">
            All Questions
          </CTA>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 sm:grid-cols-[minmax(0,220px)_1fr] sm:items-start">
          <div className="aspect-[3/4] w-full max-w-[220px] border border-bone/10 bg-charcoal">
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
          </div>
        </div>
      </Section>
    </>
  );
}
