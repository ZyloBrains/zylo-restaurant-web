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
  title: {
    default: "Fish Station | Seafood in Kathmandu",
    template: "%s | Fish Station",
  },
  description:
      "Fresh seafood restaurant in Bhatkekopul, Kathmandu. Order online, call, or WhatsApp for fast delivery and dine-in.",
  keywords: [
    "Fish Station",
    "Seafood Kathmandu",
    "Fish restaurant Nepal",
    "Grilled fish Kathmandu",
    "Seafood delivery Kathmandu",
  ],
  authors: [{ name: "Fish Station" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Fish Station | Fresh Seafood in Kathmandu",
    description:
        "Premium seafood experience in Kathmandu. Order online or via WhatsApp.",
    url: "https://fishstation.yourdomain.com",
    siteName: "Fish Station",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Fish Station Seafood",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  themeColor: "#0A2540",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${inter.variable} ${poppins.variable} font-[var(--font-body)] antialiased bg-[var(--color-background)] text-[var(--color-text)]`}
      >
      {children}
      </body>
      </html>
  );
}