import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { updateTattoo, deleteTattoo } from "@/lib/data/tattoos";
import { deleteBlobIfPresent } from "@/lib/blob";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { alt, title, description, featured, visible } = body as {
    alt?: string;
    title?: string | null;
    description?: string | null;
    featured?: boolean;
    visible?: boolean;
  };

  const row = await updateTattoo(Number(id), { alt, title, description, featured, visible });

  revalidatePath("/");
  revalidatePath("/tattoos");

  return NextResponse.json({ item: row });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const row = await deleteTattoo(Number(id));

  if (row) {
    await deleteBlobIfPresent(row.imagePathname);
  }

  revalidatePath("/");
  revalidatePath("/tattoos");

  return NextResponse.json({ item: row });
}
