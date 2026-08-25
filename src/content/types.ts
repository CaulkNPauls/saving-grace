export type ServiceKind = "tattoo" | "hair" | "nails";

export type PortfolioItem = {
  /** Path relative to /public, e.g. "/work/tattoos/example.jpg" */
  image: string;
  alt: string;
  category: ServiceKind;
  title?: string;
  featured?: boolean;
  /** Marks entries that are not real Grace artwork yet. */
  placeholder?: boolean;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type BookingStep = {
  number: string;
  title: string;
  description: string;
};

export type NavLink = {
  label: string;
  href: string;
};
