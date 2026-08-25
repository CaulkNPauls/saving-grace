import type { BookingStep, FAQItem, NavLink } from "./types";

export const site = {
  name: "Saving Grace",
  tagline: "Tattoos · Hair · Nails",
  instagramHandle: "@saving.grace.tattoos",
  instagramUrl: "https://www.instagram.com/saving.grace.tattoos/",
  // No email has been provided yet — do not invent one.
  email: null as string | null,
  domain: "savinggrace.ink",
};

export const primaryNav: NavLink[] = [
  { label: "Tattoos", href: "/tattoos" },
  { label: "Hair", href: "/hair" },
  { label: "Nails", href: "/nails" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export const bookNav: NavLink = { label: "Book", href: "/booking" };

export const hero = {
  eyebrow: "Saving Grace",
  headline: "Tattoos · Hair · Nails",
  sub: "Blackwork, custom design, and a steady hand — with hair and nails by appointment alongside it.",
  cta: "Book With Grace",
};

export const tattooSection = {
  kicker: "The Main Event",
  heading: "Tattoos",
  body: "Custom blackwork and fine linework, designed by Grace for the body that will wear it. Every piece starts as a conversation.",
  cta: "View the Work",
};

export const servicesSection = {
  kicker: "Also By Grace",
  heading: "Hair & Nails",
  services: [
    {
      name: "Hair",
      description: "Cutting, coloring, and styling — a second craft, practiced with the same care as the first.",
      href: "/hair",
    },
    {
      name: "Nails",
      description: "Clean, considered nail work for clients who already trust Grace with everything else.",
      href: "/nails",
    },
  ],
};

export const bookingSteps: BookingStep[] = [
  {
    number: "01",
    title: "Send your idea",
    description: "Tell Grace what you're picturing — placement, size, style, and any reference that helps explain it.",
  },
  {
    number: "02",
    title: "Grace reviews it",
    description: "Every request is read personally. Grace will follow up if she needs more detail before quoting.",
  },
  {
    number: "03",
    title: "Deposit + date",
    description: "A deposit secures your appointment and locks in the date. No deposit, no hold.",
  },
  {
    number: "04",
    title: "Get tattooed",
    description: "Show up ready — final design details are confirmed together at the start of your session.",
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "How much is the deposit, and is it refundable?",
    answer:
      "Tattoo appointments currently require a $50 non-refundable deposit. It applies toward the final price of your piece, but your appointment date and time are not held until it's paid.",
  },
  {
    question: "How far in advance should I book?",
    answer:
      "Availability generally runs Thursday through Saturday. Placeholder — exact booking windows and lead times will be confirmed here.",
  },
  {
    question: "Will I see my design before the appointment?",
    answer:
      "Designs are drawn by Grace and typically aren't sent ahead of time. Reasonable changes can be discussed together at the start of your appointment.",
  },
  {
    question: "Can I book a consultation first?",
    answer:
      "Yes — if you'd like to talk through a design in more detail before committing to a date, a consultation appointment is available.",
  },
  {
    question: "Do you work from AI-generated designs?",
    answer:
      "No. Grace draws her own designs and does not use or tattoo AI-generated artwork, submitted or otherwise.",
  },
];

export const about = {
  kicker: "About",
  heading: "Grace",
  bio: [
    "Placeholder biography — Grace's story, background, and approach to her craft will go here.",
    "This space is meant to sound like her: informal, personal, a little irreverent. Not a corporate bio.",
  ],
  signoff: "— Your Saving Grace",
};

export const bookingSuccess = {
  heading: "Request Sent.",
  body: "Grace will get back to you as soon as her schedule allows.",
  signoff: "— Your Saving Grace",
};
