import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Bhalobasha — ভালোবাসা | Find Your Home in Bangladesh",
  description:
    "Find flats, rooms, sublets, bachelor seats, and mess accommodations across Bangladesh.",
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
