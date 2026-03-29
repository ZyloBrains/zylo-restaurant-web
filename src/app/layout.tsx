import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

export const metadata = {
  title: "Fish Station | Seafood in Kathmandu",
  description: "Fresh seafood in Bhatkekopul Kathmandu",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fish Station",
    description: "Fresh seafood in Kathmandu",
    images: ["/images/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}