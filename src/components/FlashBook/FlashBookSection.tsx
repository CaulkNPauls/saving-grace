import Section from "@/components/Section";
import SectionHeading from "@/components/SectionHeading";
import { getVisibleFlashPages } from "@/lib/data/flash";
import FlashBookViewer from "./FlashBookViewer";
import type { FlashPublicItem } from "./types";

export default async function FlashBookSection() {
  const pages = await getVisibleFlashPages();

  // Pages are still an admin-organizing concept in the DB, but the public
  // book paginates itself responsively based on viewport, so flatten to a
  // single ordered list here (page order, then item order within it).
  const items: FlashPublicItem[] = pages.flatMap((page) =>
    page.items
      .filter((item) => item.visible)
      .map((item) => ({
        id: item.id,
        imageUrl: item.imageUrl,
        title: item.title,
        available: item.available,
      }))
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <Section surface="paper-deep" id="flash-book">
      <SectionHeading kicker="The Flash Book" heading="Available Flash" tone="ink" align="center" />
      <p className="reveal mx-auto mt-6 max-w-xl text-center font-serif text-lg text-charcoal/85">
        A book of ready-to-tattoo designs. Open it up and turn the pages.
      </p>
      <div className="mt-10">
        <FlashBookViewer items={items} />
      </div>
    </Section>
  );
}
