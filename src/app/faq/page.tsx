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
    <Section>
      <SectionHeading kicker="Good To Know" heading="FAQ" />
      <div className="mt-10">
        <FAQAccordion items={faqItems} />
      </div>
      <div className="mt-10">
        <CTA href="/booking">Book With Grace</CTA>
      </div>
    </Section>
  );
}
