import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateFlashItem, deleteFlashItem } from "@/lib/data/flash";
import { deleteBlobIfPresent } from "@/lib/blob";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, available, visible, pageId } = body as {
    title?: string | null;
    description?: string | null;
    available?: boolean;
    visible?: boolean;
    pageId?: number;
  };

  const row = await updateFlashItem(Number(id), {
    title,
    description,
    available,
    visible,
    pageId,
  });

  revalidatePath("/");

  return NextResponse.json({ item: row });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await deleteFlashItem(Number(id));

  if (row) {
    await deleteBlobIfPresent(row.imagePathname);
  }

  revalidatePath("/");

  return NextResponse.json({ item: row });
}
