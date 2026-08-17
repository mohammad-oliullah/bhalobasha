import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Providers } from "@/components/providers/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Bhalobasha — ভালোবাসা | Find Your Home in Bangladesh",
  description:
    "Find flats, rooms, sublets, bachelor seats, and mess accommodations across Bangladesh. Broker-free.",
  openGraph: {
    title: "Bhalobasha ভালোবাসা",
    description:
      "Find flats, rooms, sublets, bachelor seats, and mess accommodations across Bangladesh. Broker-free.",
    type: "website",
    url: process.env.NEXT_PUBLIC_BASE_URL,
    siteName: "Bhalobasha ভালোবাসা",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-default.webp`,
        width: 1200,
        height: 630,
        alt: "Bhalobasha — Find Your Home in Bangladesh",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bhalobasha ভালোবাসা",
    description: "Find your home in Bangladesh. Broker-free.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-8rem)]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
