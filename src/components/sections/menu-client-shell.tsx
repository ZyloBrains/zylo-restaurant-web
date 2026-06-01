"use client";

import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";

import { HeroSection } from "@/components/sections/hero-section";
import { FevItems, } from "@/components/sections/fav-items";
import { ServicesSection } from "@/components/sections/services-section";
// import type { MenuData } from "@/features/menu/menu.types";
// import type { TenantInfo } from "@/features/tenant/tenant.types";
import ExpoMenu from "./expo-menu";
import { useTenantStore } from "@/features/tenant/tenant.store";


export function MenuClientShell() {

  const tenantInfo=useTenantStore((s)=>s.tenant);
  return (
    
    <div className="min-h-screen bg-[var(--color-background)] pb-24 text-[var(--color-text)] md:pb-0">
      {/* MAIN CONTENT ONLY */}
      <main>
        <HeroSection
          restaurantName={tenantInfo?.restaurantName as string}
          title={tenantInfo?.heroTitle as string}
          subtitle={tenantInfo?.heroSubtitle as string}
          phone={tenantInfo?.phone as string}
        />

        <ExpoMenu />

        <FevItems  />

        <ServicesSection />

      </main>

      {/* MOBILE ACTION BAR */}
      <MobileBottomBar
        phone={tenantInfo?.phone as string}
        whatsappNumber={tenantInfo?.whatsappNumber as string}
      />

      {/* CART SYSTEM */}
      <CartDrawer
        restaurantName={tenantInfo?.restaurantName as string}
        whatsappNumber={tenantInfo?.whatsappNumber as string}
      />
    </div>
  );
}