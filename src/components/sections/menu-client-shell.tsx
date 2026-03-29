"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { MenuSection } from "@/components/sections/menu-section";
import { ServicesSection } from "@/components/sections/services-section";
import { CartProvider } from "@/features/cart/cart-context";
import type { MenuData } from "@/features/menu/menu.types";
import type { TenantInfo } from "@/features/tenant/tenant.types";

type MenuClientShellProps = {
    tenant: TenantInfo;
    menu: MenuData;
};

export function MenuClientShell({ tenant, menu }: MenuClientShellProps) {
    const address = `${tenant.addressLine1}, ${tenant.area}, ${tenant.city}, ${tenant.country}`;

    return (
        <CartProvider>
            <Header restaurantName={tenant.restaurantName} />

            <HeroSection
                restaurantName={tenant.restaurantName}
                title={tenant.heroTitle}
                subtitle={tenant.heroSubtitle}
                phone={tenant.phone}
            />

            <AboutSection
                description={tenant.description}
                address={address}
            />

            <MenuSection menu={menu} />

            <ServicesSection />

            <ContactSection
                phone={tenant.phone}
                whatsappNumber={tenant.whatsappNumber}
                email={tenant.email}
                address={address}
                mapsUrl={tenant.mapsUrl}
            />

            <Footer
                restaurantName={tenant.restaurantName}
                address={address}
                phone={tenant.phone}
            />

            <MobileBottomBar
                phone={tenant.phone}
                whatsappNumber={tenant.whatsappNumber}
            />

            <CartDrawer />
        </CartProvider>
    );
}