import Link from "next/link";

type ServiceCardProps = {
  name: string;
  description: string;
  href: string;
};

export default function ServiceCard({ name, description, href }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group reveal flex flex-col justify-between border border-bone/10 bg-charcoal p-6 transition-colors hover:border-oxblood-bright/60 sm:p-10"
    >
      <div>
        <h3 className="font-display text-xl uppercase tracking-wide text-bone sm:text-2xl">
          {name}
        </h3>
        <p className="mt-3 max-w-sm font-serif text-base text-parchment/85">{description}</p>
      </div>
      <span className="mt-8 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-wide text-parchment/70 transition-colors group-hover:text-oxblood-bright">
        Learn more
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </span>
    </Link>
  );
}
