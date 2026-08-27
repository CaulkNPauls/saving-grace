import { getAllTattoosForAdmin } from "@/lib/data/tattoos";
import TattoosAdmin from "./TattoosAdmin";

export const dynamic = "force-dynamic";

export default async function AdminTattoosPage() {
  const items = await getAllTattoosForAdmin();
  return <TattoosAdmin initialItems={items} />;
}
