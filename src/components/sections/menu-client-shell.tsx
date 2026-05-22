"use client";

import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";

import { HeroSection } from "@/components/sections/hero-section";
import { FevItems, MenuSection } from "@/components/sections/fav-items";
import { ServicesSection } from "@/components/sections/services-section";
import type { MenuData } from "@/features/menu/menu.types";
import type { TenantInfo } from "@/features/tenant/tenant.types";
import ExpoMenu from "./expo-menu";

type MenuClientShellProps = {
  tenant: TenantInfo;
  menu: MenuData;
};

export function MenuClientShell({ tenant, menu }: MenuClientShellProps) {
  const address = `${tenant.addressLine1}, ${tenant.area}, ${tenant.city}, ${tenant.country}`;

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24 text-[var(--color-text)] md:pb-0">

      {/* MAIN CONTENT ONLY */}
      <main>
        <HeroSection
          restaurantName={tenant.restaurantName}
          title={tenant.heroTitle}
          subtitle={tenant.heroSubtitle}
          phone={tenant.phone}
        />

        <ExpoMenu menu={menu} />

        <FevItems menu={menu} />

        <ServicesSection />

      </main>

      {/* MOBILE ACTION BAR */}
      <MobileBottomBar
        phone={tenant.phone}
        whatsappNumber={tenant.whatsappNumber}
      />

      {/* CART SYSTEM */}
      <CartDrawer
        restaurantName={tenant.restaurantName}
        whatsappNumber={tenant.whatsappNumber}
      />
    </div>
  );
}