"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";

import type { TenantInfo } from "@/features/tenant/tenant.types";

type AppShellProps = {
  tenant: TenantInfo;
  children: React.ReactNode;
};

export function AppShell({ tenant, children }: AppShellProps) {
  const address = `${tenant.addressLine1}, ${tenant.area}, ${tenant.city}, ${tenant.country}`;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24 text-[var(--color-text)] md:pb-0">

      {/* HEADER (GLOBAL) */}
      <Header restaurantName={tenant.restaurantName} />

      {/* PAGE CONTENT */}
      <main>{children}</main>

      {/* FOOTER (GLOBAL) */}
      <Footer
        restaurantName={tenant.restaurantName}
        address={address}
        phone={tenant.phone}
      />

      {/* MOBILE BAR */}
      <MobileBottomBar
        phone={tenant.phone}
        whatsappNumber={tenant.whatsappNumber}
      />

      {/* CART */}
      <CartDrawer
        restaurantName={tenant.restaurantName}
        whatsappNumber={tenant.whatsappNumber}
      />
    </div>
  );
}