import type { Metadata } from "next";
import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import BookingFormShell from "@/components/BookingFormShell";

export const metadata: Metadata = {
  title: "Book — Saving Grace",
  description: "Request a tattoo, hair, or nail appointment with Saving Grace.",
};

export default function BookingPage() {
  return (
    <Section>
      <SectionHeading kicker="Book" heading="Request an Appointment" align="center" />
      <div className="mt-12">
        <BookingFormShell />
      </div>
    </Section>
  );
}
