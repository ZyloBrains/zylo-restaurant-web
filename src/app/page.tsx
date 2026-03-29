import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ServicesSection } from "@/components/sections/services-section";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fishStationMenu } from "@/features/menu/menu.mock";
import { fishStationTenant } from "@/features/tenant/tenant.mock";
import { buildThemeStyle } from "@/lib/theme/theme.tokens";

export default function HomePage() {
  const tenant = fishStationTenant;
  const featuredItems = fishStationMenu.items.filter((item) => item.isFeatured);
  const themeStyle = buildThemeStyle(tenant.theme);

  const address = `${tenant.addressLine1}, ${tenant.area}, ${tenant.city}, ${tenant.country}`;

  return (
      <main
          className="min-h-screen pb-24 md:pb-0"
          style={{
            ...themeStyle,
            fontFamily: "var(--font-body, Inter)",
            backgroundColor: "var(--color-background)",
            color: "var(--color-text)",
          }}
      >
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

        <section id="menu" className="py-16 md:py-20">
          <Container>
            <SectionTitle
                eyebrow="Featured Menu"
                title="Popular dishes your customers will notice first"
                description="This is still static mock data for client presentation. Real menu integration will come in the next phase."
            />

            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredItems.map((item) => (
                  <div
                      key={item.id}
                      className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]"
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100" />

                    <div className="mt-5">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <span className="text-sm font-bold text-[var(--color-primary)]">
                      NPR {item.price}
                    </span>
                      </div>

                      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                        {item.shortDescription}
                      </p>

                      <button className="mt-5 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white">
                        Add to Cart
                      </button>
                    </div>
                  </div>
              ))}
            </div>
          </Container>
        </section>

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
      </main>
  );
}