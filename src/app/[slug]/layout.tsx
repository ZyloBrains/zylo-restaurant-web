import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";

import { CartProvider } from "@/features/cart/cart-context";
import { AppShell } from "@/components/layout/app-shell";
import { TenantBootstrap } from "@/components/bootstrap/tenant-bootstrap";

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

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{slug:string}>;
}) {
  const {slug}= await params;
  return (
    <div
      className={`${inter.variable} ${poppins.variable} font-[var(--font-body)] antialiased bg-[var(--color-background)] text-[var(--color-text)] min-h-screen`}
    >

      <TenantBootstrap tenantSlug={slug} />

        <CartProvider>
          <AppShell>{children}</AppShell>
        </CartProvider>
      

      <Toaster
        position="top-center"
        offset="80px"
        closeButton
        duration={2200}
        toastOptions={{ unstyled: true }}
      />
    </div>
  );
}
