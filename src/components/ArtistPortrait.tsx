import Image from "next/image";

export default function ArtistPortrait() {
  return (
    <figure className="plate instant-print mx-auto w-full max-w-[220px] sm:mx-0">
      <div className="instant-print-photo relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
        <Image
          src="/branding/saving-grace-bunny-head.png?v=portrait"
          alt="Saving Grace jackalope mark"
          fill
          unoptimized
          sizes="220px"
          className="object-contain p-5"
        />
      </div>
      <figcaption className="instant-print-caption flex items-baseline justify-between gap-3">
        <span className="font-serif text-sm italic text-ink/80">Grace</span>
        <span className="font-sans text-[0.65rem] uppercase tracking-widest text-ink/40">Artist</span>
      </figcaption>
    </figure>
  );
}
