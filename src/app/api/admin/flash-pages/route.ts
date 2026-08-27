import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllFlashPagesForAdmin, createFlashPage } from "@/lib/data/flash";

export async function GET() {
  const pages = await getAllFlashPagesForAdmin();
  return NextResponse.json({ pages });
}

export async function POST() {
  const page = await createFlashPage();
  revalidatePath("/");
  return NextResponse.json({ page }, { status: 201 });
}
