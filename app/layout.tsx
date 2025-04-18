import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agrofix - Bulk Vegetable & Fruit Orders",
  description: "Order fresh vegetables and fruits in bulk with Agrofix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} antialiased bg-gray-50`}>
        <Header />
        <main className="container mx-auto py-8 px-4">
          {children}
        </main>
          <Footer />
      </body>
    </html>
  );
}
