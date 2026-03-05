import type { Metadata } from "next";
import { Shippori_Antique_B1, Urbanist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import LenisProvider from "./providers/LenisProvider";

const shipporiAntiqueB1 = Shippori_Antique_B1({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400"],
});

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Monarch Media House",
  description: "Infotainment-led social content that builds authority, drives massive reach, and converts attention into long-term growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#F0EDE8" }}>
      <body
        className={`${shipporiAntiqueB1.variable} ${urbanist.variable} antialiased overflow-x-hidden`}
        style={{ backgroundColor: "#F0EDE8" }}
      >
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
