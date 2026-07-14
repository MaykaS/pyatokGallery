import type { Metadata } from "next";
import { IBM_Plex_Sans, PT_Serif } from "next/font/google";

import "./globals.css";

const headingFont = PT_Serif({
  subsets: ["latin", "cyrillic"],
  variable: "--font-pt-serif",
  weight: ["400", "700"],
});

const bodyFont = IBM_Plex_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-ibm-plex-sans",
  weight: ["400", "500"],
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
