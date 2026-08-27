import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllTattoosForAdmin, createTattoo } from "@/lib/data/tattoos";
import { optimizeAndStoreBlob } from "@/lib/blob";

export async function GET() {
  const items = await getAllTattoosForAdmin();
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { rawUrl, alt, title, description } = body as {
    rawUrl?: string;
    alt?: string;
    title?: string;
    description?: string;
  };

  if (!rawUrl || !alt) {
    return NextResponse.json({ error: "rawUrl and alt are required" }, { status: 400 });
  }

  const { url, pathname } = await optimizeAndStoreBlob(rawUrl, "tattoos");

  const row = await createTattoo({
    imageUrl: url,
    imagePathname: pathname,
    alt,
    title: title || null,
    description: description || null,
  });

  revalidatePath("/");
  revalidatePath("/tattoos");

  return NextResponse.json({ item: row }, { status: 201 });
}
