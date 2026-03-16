import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import LenisProvider from "./providers/LenisProvider";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const tiemposHeadline = localFont({
  src: [
    {
      path: "../font/TiemposHeadline-Light.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../font/TiemposHeadline-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../font/TiemposHeadline-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../font/TiemposHeadline-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../font/TiemposHeadline-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../font/TiemposHeadline-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-tiempos-headline",
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
    <html lang="en" className={`${spaceGrotesk.variable} ${tiemposHeadline.variable}`} style={{ backgroundColor: "#F0EDE8" }}>
      <body
        className="antialiased overflow-x-hidden"
        style={{ backgroundColor: "#F0EDE8" }}
      >
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-Y5K0QVBVTH"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-Y5K0QVBVTH');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "vwhvs1dyvx");
          `}
        </Script>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
