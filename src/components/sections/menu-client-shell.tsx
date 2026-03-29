"use client";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { MenuSection } from "@/components/sections/menu-section";
import { OpeningHoursSection } from "@/components/sections/opening-hours-section";
import { ServicesSection } from "@/components/sections/services-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { WhyChooseUsSection } from "@/components/sections/why-choose-us-section";
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
            <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
                <Header restaurantName={tenant.restaurantName} />

                <main>
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

                    <WhyChooseUsSection />

                    <MenuSection menu={menu} />

                    <GallerySection />

                    <ServicesSection />

                    <OpeningHoursSection hours={tenant.openingHours} />

                    <TestimonialsSection />

                    <ContactSection
                        phone={tenant.phone}
                        whatsappNumber={tenant.whatsappNumber}
                        email={tenant.email}
                        address={address}
                        mapsUrl={tenant.mapsUrl}
                    />
                </main>

                <Footer
                    restaurantName={tenant.restaurantName}
                    address={address}
                    phone={tenant.phone}
                />

                <MobileBottomBar
                    phone={tenant.phone}
                    whatsappNumber={tenant.whatsappNumber}
                />

                <CartDrawer
                    restaurantName={tenant.restaurantName}
                    whatsappNumber={tenant.whatsappNumber}
                />
            </div>
        </CartProvider>
    );
}