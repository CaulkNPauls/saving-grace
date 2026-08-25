import Image from "next/image";
import CTA from "./CTA";
import { hero, site } from "@/content/site";

export default function Hero() {
  return (
    <section className="paper document-hero border-b-2 border-ink/70">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 py-14 text-center sm:gap-6 sm:py-20">
        <div className="reveal relative h-44 w-44 sm:h-64 sm:w-64">
          <Image
            src="/branding/saving-grace-logo-transparent.png"
            alt={`${site.name} — blackwork jackalope with antlers logo`}
            fill
            priority
            sizes="(min-width: 640px) 16rem, 10rem"
            className="object-contain mix-blend-multiply opacity-95"
          />
        </div>

        <p className="reveal font-display text-base uppercase tracking-[0.35em] text-ink sm:text-xl">
          {hero.headline}
        </p>

        <p className="reveal max-w-sm font-serif text-base italic text-charcoal sm:text-lg">
          {hero.sub}
        </p>

        <CTA href="/booking" className="reveal mt-1">
          {hero.cta}
        </CTA>
      </div>
    </section>
  );
}
