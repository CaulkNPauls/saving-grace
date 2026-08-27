import { getAllFlashPagesForAdmin } from "@/lib/data/flash";
import FlashAdmin from "./FlashAdmin";

export const dynamic = "force-dynamic";

export default async function AdminFlashPage() {
  const pages = await getAllFlashPagesForAdmin();
  return <FlashAdmin initialPages={pages} />;
}
