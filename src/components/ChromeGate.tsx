"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";
import SelectedFlashBadge from "@/components/FlashBook/SelectedFlashBadge";

/** Hides the public site chrome (nav, footer, floating book bar) on /admin routes. */
export default function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="document-shell flex-1">{children}</main>
      <Footer />
      <MobileBookBar />
      <SelectedFlashBadge />
    </>
  );
}
