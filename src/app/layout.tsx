import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import { CartProvider } from "@/features/cart/cart-context";
import { AppShell } from "@/components/layout/app-shell";
import { fishStationTenant as tenant } from "@/features/tenant/tenant.mock";
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
  title: "Fish Station | Seafood in Kathmandu",
  description:
    "Fresh seafood restaurant in Kathmandu. Order online or visit us.",
};

export const viewport: Viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} font-[var(--font-body)] antialiased bg-[var(--color-background)] text-[var(--color-text)]`}
      >
        <CartProvider>
          <AppShell tenant={tenant}>
            {children}
          </AppShell>
        </CartProvider>

        <Toaster
          position="top-center"
          offset="80px"
          closeButton
          duration={2200}
          toastOptions={{ unstyled: true }}
        />
      </body>
    </html>
  );
}