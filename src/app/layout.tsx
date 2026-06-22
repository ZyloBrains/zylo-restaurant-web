import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zylo RMS - Restaurant Management System",
  description:
    "All-in-one restaurant management software. POS, online ordering, inventory, staff management, and analytics for restaurants, cafes, and food courts.",
  keywords: [
    "restaurant management",
    "POS system",
    "online ordering",
    "inventory management",
    "restaurant software",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${poppins.variable} min-h-screen bg-(--color-background) text-(--color-text) antialiased font-(--font-body)`}
      >
        {children}
      </body>
    </html>
  );
}