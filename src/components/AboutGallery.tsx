import Image from "next/image";

const photos = [
  {
    image: "/about/grace-portrait-1.jpg",
    alt: "Grace, the artist behind Saving Grace",
    caption: "Grace",
  },
  {
    image: "/about/grace-tattooing.jpg",
    alt: "Grace at work tattooing a client",
    caption: "At Work",
  },
  {
    image: "/about/grace-portrait-2.jpg",
    alt: "Grace in the studio at Red Carpet Ink",
    caption: "In the Studio",
  },
];

export default function AboutGallery() {
  return (
    <div className="grid grid-cols-3 items-start gap-2.5 sm:gap-5 lg:gap-7">
      {photos.map((photo) => (
        <figure key={photo.image} className="plate instant-print reveal min-w-0">
          <div className="instant-print-photo relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 350px, 33vw"
              className="object-cover"
            />
          </div>
          <figcaption className="instant-print-caption flex min-w-0 items-baseline justify-between gap-1 sm:gap-3">
            <span className="truncate font-serif text-[0.65rem] italic text-ink/80 sm:text-sm">{photo.caption}</span>
            <span className="hidden shrink-0 font-sans text-[0.65rem] uppercase tracking-widest text-ink/40 sm:inline">
              Artist
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
