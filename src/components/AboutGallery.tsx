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
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-1">
      {photos.map((photo) => (
        <figure key={photo.image} className="plate instant-print reveal first:col-span-2 sm:first:col-span-1">
          <div className="instant-print-photo relative aspect-[3/4] w-full overflow-hidden bg-charcoal">
            <Image
              src={photo.image}
              alt={photo.alt}
              fill
              sizes="(min-width: 640px) 200px, 50vw"
              className="object-cover"
            />
          </div>
          <figcaption className="instant-print-caption flex items-baseline justify-between gap-3">
            <span className="font-serif text-sm italic text-ink/80">{photo.caption}</span>
            <span className="shrink-0 font-sans text-[0.65rem] uppercase tracking-widest text-ink/40">
              Artist
            </span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
