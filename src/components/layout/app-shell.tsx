"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import React from "react";
import { useTenantStore } from "@/features/tenant/tenant.store";


export function AppShell({ children }: { children: React.ReactNode }) {
  const tenant = useTenantStore((s)=>s.tenant);
  const loading= useTenantStore((s)=>s.loading);
   if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading restaurant...
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Restaurant not found
      </div>
    );
  }

  const address = `${tenant?.addressLine1}, ${tenant?.area}, ${tenant?.city}, ${tenant?.country}`;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24 text-[var(--color-text)] md:pb-0">

      <Header  />

      <main>{children}</main>

      <Footer
        restaurantName={tenant?.restaurantName as string}
        address={address}
        phone={tenant?.phone as string}
      />

      <MobileBottomBar
        phone={tenant?.phone as string}
        whatsappNumber={tenant?.whatsappNumber as string}
      />


      <CartDrawer
        restaurantName={tenant?.restaurantName as string}
        whatsappNumber={tenant?.whatsappNumber as string}
      />
    </div>
  );
}
