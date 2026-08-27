import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { reorderTattoos } from "@/lib/data/tattoos";

export async function POST(request: Request) {
  const { orderedIds } = (await request.json()) as { orderedIds?: number[] };

  if (!Array.isArray(orderedIds)) {
    return NextResponse.json({ error: "orderedIds must be an array" }, { status: 400 });
  }

  await reorderTattoos(orderedIds);

  revalidatePath("/");
  revalidatePath("/tattoos");

  return NextResponse.json({ ok: true });
}
