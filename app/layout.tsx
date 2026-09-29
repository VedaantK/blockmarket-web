import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const body = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const description =
  "The CMU marketplace for spare meal blocks. See how many blocks you should have left, eat for less, or get paid for blocks you won't use.";

export const metadata: Metadata = {
  metadataBase: new URL("https://blockmarket.app"),
  title: "Block Market | CMU meal block tracker and marketplace",
  description,
  openGraph: {
    title: "Block Market",
    description,
    siteName: "Block Market",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Block Market",
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
