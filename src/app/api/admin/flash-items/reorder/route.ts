import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { reorderFlashItems } from "@/lib/data/flash";

export async function POST(request: Request) {
  const { items } = (await request.json()) as {
    items?: { id: number; pageId: number; sortOrder: number }[];
  };

  if (!Array.isArray(items)) {
    return NextResponse.json({ error: "items must be an array" }, { status: 400 });
  }

  await reorderFlashItems(items);
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
