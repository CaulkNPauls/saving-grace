import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { reorderFlashPages } from "@/lib/data/flash";

export async function POST(request: Request) {
  const { orderedIds } = (await request.json()) as { orderedIds?: number[] };

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
  }

  await reorderFlashPages(orderedIds);
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
