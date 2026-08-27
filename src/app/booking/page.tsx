import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BookingFormShell from "@/components/BookingFormShell";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Book — Saving Grace",
  description: "Request a custom tattoo appointment with Saving Grace.",
};

export default function BookingPage() {
  return (
    <Section surface="paper-deep">
      <SectionHeading kicker="Book" heading="Request an Appointment" align="center" tone="ink" />
      <p className="mx-auto mt-5 max-w-xl text-center font-serif text-base text-charcoal/80">
        Appointments take place at {site.studio.name}, {site.studio.street}, {site.studio.city}{" "}
        ({site.studio.detail}). Submit your idea below and Grace will follow up personally.
      </p>
      <div className="mt-12">
        <BookingFormShell />
      </div>
    </Section>
  );
}
