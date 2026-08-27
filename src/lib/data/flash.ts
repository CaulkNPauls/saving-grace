import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { flashPages, flashItems, type FlashPage, type FlashItem } from "@/db/schema";

export type FlashPageWithItems = FlashPage & { items: FlashItem[] };

export async function getVisibleFlashPages(): Promise<FlashPageWithItems[]> {
  const pages = await db.select().from(flashPages).orderBy(asc(flashPages.sortOrder));
  const items = await db
    .select()
    .from(flashItems)
    .where(eq(flashItems.visible, true))
    .orderBy(asc(flashItems.sortOrder));

  return pages
    .map((page) => ({
      ...page,
      items: items.filter((item) => item.pageId === page.id),
    }))
    .filter((page) => page.items.length > 0);
}

export async function getAllFlashPagesForAdmin(): Promise<FlashPageWithItems[]> {
  const pages = await db.select().from(flashPages).orderBy(asc(flashPages.sortOrder));
  const items = await db.select().from(flashItems).orderBy(asc(flashItems.sortOrder));

  return pages.map((page) => ({
    ...page,
    items: items.filter((item) => item.pageId === page.id),
  }));
}

export async function createFlashPage() {
  const existing = await db.select().from(flashPages).orderBy(asc(flashPages.sortOrder));
  const [row] = await db
    .insert(flashPages)
    .values({ sortOrder: existing.length })
    .returning();
  return row;
}

export async function deleteFlashPage(id: number) {
  const items = await db.select().from(flashItems).where(eq(flashItems.pageId, id));
  if (items.length > 0) {
    throw new Error("Cannot delete a page that still has flash items on it.");
  }
  const [row] = await db.delete(flashPages).where(eq(flashPages.id, id)).returning();
  return row;
}

export async function reorderFlashPages(orderedIds: number[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(flashPages).set({ sortOrder: index }).where(eq(flashPages.id, id))
    )
  );
}

export async function createFlashItem(data: {
  pageId: number;
  imageUrl: string;
  imagePathname: string | null;
  title?: string | null;
  description?: string | null;
  sourceSheet?: string | null;
}) {
  const existing = await db
    .select()
    .from(flashItems)
    .where(eq(flashItems.pageId, data.pageId));
  const [row] = await db
    .insert(flashItems)
    .values({
      pageId: data.pageId,
      imageUrl: data.imageUrl,
      imagePathname: data.imagePathname,
      title: data.title ?? null,
      description: data.description ?? null,
      sourceSheet: data.sourceSheet ?? null,
      sortOrder: existing.length,
    })
    .returning();
  return row;
}

export async function getFlashItemById(id: number): Promise<FlashItem | undefined> {
  const [row] = await db.select().from(flashItems).where(eq(flashItems.id, id));
  return row;
}

export async function updateFlashItem(
  id: number,
  data: Partial<{
    pageId: number;
    title: string | null;
    description: string | null;
    available: boolean;
    visible: boolean;
    sortOrder: number;
  }>
) {
  const [row] = await db
    .update(flashItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(flashItems.id, id))
    .returning();
  return row;
}

export async function deleteFlashItem(id: number) {
  const [row] = await db.delete(flashItems).where(eq(flashItems.id, id)).returning();
  return row;
}

/** Reorders/reassigns items for one or more affected pages in a single call. */
export async function reorderFlashItems(
  items: { id: number; pageId: number; sortOrder: number }[]
) {
  await Promise.all(
    items.map((item) =>
      db
        .update(flashItems)
        .set({ pageId: item.pageId, sortOrder: item.sortOrder })
        .where(eq(flashItems.id, item.id))
    )
  );
}
