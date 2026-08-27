import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createFlashItem } from "@/lib/data/flash";
import { optimizeAndStoreBlob } from "@/lib/blob";

export async function POST(request: Request) {
  const body = await request.json();
  const { rawUrl, pageId, title, description } = body as {
    rawUrl?: string;
    pageId?: number;
    title?: string;
    description?: string;
  };

  if (!rawUrl || !pageId) {
    return NextResponse.json({ error: "rawUrl and pageId are required" }, { status: 400 });
  }

  const { url, pathname } = await optimizeAndStoreBlob(rawUrl, "flash");

  const row = await createFlashItem({
    pageId,
    imageUrl: url,
    imagePathname: pathname,
    title: title || null,
    description: description || null,
  });

  revalidatePath("/");

  return NextResponse.json({ item: row }, { status: 201 });
}
