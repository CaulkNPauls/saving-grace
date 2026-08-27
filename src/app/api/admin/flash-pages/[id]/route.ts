import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteFlashPage } from "@/lib/data/flash";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const row = await deleteFlashPage(Number(id));
    revalidatePath("/");
    return NextResponse.json({ page: row });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete page" },
      { status: 400 }
    );
  }
}
