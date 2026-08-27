import type { Metadata } from "next";
import { Cinzel, Playfair_Display, Inter, UnifrakturCook } from "next/font/google";
import ChromeGate from "@/components/ChromeGate";
import { FlashSelectionProvider } from "@/lib/flashSelection";
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

const unifraktur = UnifrakturCook({
  variable: "--font-unifraktur",
  subsets: ["latin"],
  weight: "700",
});

export const metadata: Metadata = {
  title: "Saving Grace — Custom Tattoos",
  description:
    "Bold custom tattoos and blackwork designed by Grace in North Tonawanda, New York.",
  metadataBase: new URL("https://savinggrace.ink"),
  openGraph: {
    title: "Saving Grace — Custom Tattoos",
    description:
      "Bold custom tattoos and blackwork designed by Grace in North Tonawanda, New York.",
    siteName: "Saving Grace",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${playfair.variable} ${inter.variable} ${unifraktur.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-bone">
        <FlashSelectionProvider>
          <ChromeGate>{children}</ChromeGate>
        </FlashSelectionProvider>
      </body>
    </html>
  );
}
