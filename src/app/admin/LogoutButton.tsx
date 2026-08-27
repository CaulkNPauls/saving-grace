"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="border border-bone/30 px-3 py-1.5 font-sans text-xs uppercase tracking-wide text-bone/80 hover:bg-bone/10"
    >
      Log Out
    </button>
  );
}
