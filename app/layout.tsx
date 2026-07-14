import type { Metadata } from "next";
import { Cormorant_Garamond, Lora } from "next/font/google";

import "./globals.css";

const headingFont = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  variable: "--font-cormorant",
  weight: ["400", "600"],
});

const bodyFont = Lora({
  subsets: ["latin", "cyrillic"],
  variable: "--font-lora",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "Pyatok Gallery",
  description: "A minimalist online gallery for Pyatok's artworks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${headingFont.variable} ${bodyFont.variable}`}
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
