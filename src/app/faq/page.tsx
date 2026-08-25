import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import FAQAccordion from "@/components/FAQAccordion";
import CTA from "@/components/CTA";
import { faqItems } from "@/content/site";

export const metadata: Metadata = {
  title: "FAQ — Saving Grace",
  description: "Frequently asked questions about booking, deposits, and policies at Saving Grace.",
};

export default function FAQPage() {
  return (
    <Section surface="paper-deep">
      <SectionHeading kicker="The Fine Print" heading="Notes From Grace" tone="ink" />
      <div className="mt-10">
        <FAQAccordion items={faqItems} />
      </div>
      <div className="mt-10">
        <CTA href="/booking" variant="outline-ink">
          Book With Grace
        </CTA>
      </div>
    </Section>
  );
}
