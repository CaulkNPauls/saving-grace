import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { tattooItems, type TattooItem } from "@/db/schema";
import type { PortfolioItem } from "@/content/types";

function toPortfolioItem(row: TattooItem): PortfolioItem {
  return {
    image: row.imageUrl,
    alt: row.alt,
    category: "tattoo",
    title: row.title ?? undefined,
    featured: row.featured,
  };
}

export async function getFeaturedTattoos(): Promise<PortfolioItem[]> {
  const rows = await db
    .select()
    .from(tattooItems)
    .where(eq(tattooItems.visible, true))
    .orderBy(asc(tattooItems.sortOrder));
  return rows.filter((row) => row.featured).map(toPortfolioItem);
}

export async function getVisibleTattoos(): Promise<PortfolioItem[]> {
  const rows = await db
    .select()
    .from(tattooItems)
    .where(eq(tattooItems.visible, true))
    .orderBy(asc(tattooItems.sortOrder));
  return rows.map(toPortfolioItem);
}

export async function getAllTattoosForAdmin(): Promise<TattooItem[]> {
  return db.select().from(tattooItems).orderBy(asc(tattooItems.sortOrder));
}

export async function createTattoo(data: {
  imageUrl: string;
  imagePathname: string | null;
  alt: string;
  title?: string | null;
  description?: string | null;
}) {
  const existing = await db.select().from(tattooItems).orderBy(asc(tattooItems.sortOrder));
  const nextOrder = existing.length;
  const [row] = await db
    .insert(tattooItems)
    .values({
      imageUrl: data.imageUrl,
      imagePathname: data.imagePathname,
      alt: data.alt,
      title: data.title ?? null,
      description: data.description ?? null,
      sortOrder: nextOrder,
    })
    .returning();
  return row;
}

export async function updateTattoo(
  id: number,
  data: Partial<{
    alt: string;
    title: string | null;
    description: string | null;
    featured: boolean;
    visible: boolean;
  }>
) {
  const [row] = await db
    .update(tattooItems)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(tattooItems.id, id))
    .returning();
  return row;
}

export async function deleteTattoo(id: number) {
  const [row] = await db.delete(tattooItems).where(eq(tattooItems.id, id)).returning();
  return row;
}

export async function reorderTattoos(orderedIds: number[]) {
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(tattooItems).set({ sortOrder: index }).where(eq(tattooItems.id, id))
    )
  );
}
