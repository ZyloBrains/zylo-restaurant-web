import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "../globals.css";

import { CartProvider } from "@/features/cart/cart-context";
import { AppShell } from "@/components/layout/app-shell";
import { HydrationBootstrap } from "@/components/bootstrap/hydration-bootstrap";
import { generateTenantMetadata } from "@/seo/tenant-metadata";

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


export const viewport: Viewport = {
  themeColor: "#0A2540",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata({
  params,
}:{
  params:Promise<{slug:string}>
}):Promise<Metadata>{
  const {slug} = await params;
  console.log("GenerateMetaData called: ",slug);
  return generateTenantMetadata(slug);
}

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
      className={`${inter.variable} ${poppins.variable} font-(--font-body)] antialiased bg-(--color-background)] text-(--color-text)] min-h-screen`}
    >

      <HydrationBootstrap slug={slug} />
      <CartProvider slug={slug}>
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
