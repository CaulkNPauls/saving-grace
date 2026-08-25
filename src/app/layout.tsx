import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBookBar from "@/components/MobileBookBar";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Saving Grace — Tattoos, Hair & Nails",
  description:
    "Saving Grace: custom tattoos, hair, and nails. Blackwork and fine-line tattoos by Grace, with hair and nail services by appointment.",
  metadataBase: new URL("https://savinggrace.ink"),
  openGraph: {
    title: "Saving Grace — Tattoos, Hair & Nails",
    description:
      "Custom tattoos, hair, and nails. Blackwork and fine-line tattoos by Grace.",
    siteName: "Saving Grace",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-bone">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileBookBar />
      </body>
    </html>
  );
}
