import Link from "next/link";
import { site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="border-t border-bone/10 px-6 pb-28 pt-12 text-sm text-parchment/70 sm:px-8 sm:pb-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-lg uppercase tracking-[0.2em] text-bone">{site.name}</p>
          <p className="mt-2 max-w-xs font-serif italic text-parchment/80">{site.tagline}</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="mb-1 font-sans text-xs uppercase tracking-widest text-metal">Connect</p>
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-oxblood-bright"
          >
            Instagram — {site.instagramHandle}
          </a>
          {site.email && (
            <a
              href={`mailto:${site.email}`}
              className="transition-colors hover:text-oxblood-bright"
            >
              {site.email}
            </a>
          )}
          <Link href="/booking" className="transition-colors hover:text-oxblood-bright">
            Book an appointment
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          <p className="mb-1 font-sans text-xs uppercase tracking-widest text-metal">Studio</p>
          <address className="flex flex-col gap-1 not-italic">
            <span className="text-bone">{site.studio.name}</span>
            <span>{site.studio.street}</span>
            <span>{site.studio.city}</span>
            <span>{site.studio.detail}</span>
          </address>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Red+Carpet+Ink+26+Webster+Street+North+Tonawanda+NY+14120"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 transition-colors hover:text-oxblood-bright"
          >
            Get directions
          </a>
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-6xl border-t border-bone/10 pt-6 text-xs text-metal">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </p>
    </footer>
  );
}
