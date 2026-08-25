import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BookingFormShell from "@/components/BookingFormShell";

export const metadata: Metadata = {
  title: "Book — Saving Grace",
  description: "Request a custom tattoo appointment with Saving Grace.",
};

export default function BookingPage() {
  return (
    <Section surface="paper-deep">
      <SectionHeading kicker="Book" heading="Request an Appointment" align="center" tone="ink" />
      <div className="mt-12">
        <BookingFormShell />
      </div>
    </Section>
  );
}
