import Image from "next/image";
import CTA from "./CTA";
import { hero, site } from "@/content/site";

export default function Hero() {
  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center gap-8 border-b border-bone/10 px-6 py-24 text-center">
      <p className="reveal font-display text-sm uppercase tracking-[0.5em] text-parchment">
        {hero.eyebrow}
      </p>

      <div className="reveal relative h-52 w-52 sm:h-72 sm:w-72">
        <Image
          src="/branding/saving-grace-logo.png"
          alt={`${site.name} — blackwork jackalope with antlers logo`}
          fill
          priority
          sizes="(min-width: 640px) 18rem, 13rem"
          className="object-contain"
        />
      </div>

      <h1 className="reveal font-display text-2xl uppercase tracking-[0.35em] text-bone sm:text-4xl">
        {hero.headline}
      </h1>

      <p className="reveal max-w-md font-serif text-lg text-parchment/90 sm:text-xl">
        {hero.sub}
      </p>

      <CTA href="/booking" className="reveal">
        {hero.cta}
      </CTA>
    </section>
  );
}
