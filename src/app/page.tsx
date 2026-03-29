import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fishStationMenu } from "@/features/menu/menu.mock";
import { fishStationTenant } from "@/features/tenant/tenant.mock";
import { buildThemeStyle } from "@/lib/theme/theme.tokens";

export default function HomePage() {
  const tenant = fishStationTenant;
  const featuredItems = fishStationMenu.items.filter((item) => item.isFeatured);
  const themeStyle = buildThemeStyle(tenant.theme);

  return (
    <main
      className="min-h-screen"
      style={{
        ...themeStyle,
        fontFamily: "var(--font-body, Inter)",
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      <section className="border-b border-slate-200 bg-[var(--color-surface)] py-20">
        <Container>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {tenant.restaurantName}
          </p>

          <h1
            className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-heading, Poppins)" }}
          >
            {tenant.heroTitle}
          </h1>

          <p className="mt-5 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
            {tenant.heroSubtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white">
              Order Now
            </button>
            <button className="rounded-[var(--radius-button)] border border-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)]">
              View Menu
            </button>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionTitle
            eyebrow="About"
            title="A premium seafood experience in Kathmandu"
            description={tenant.description}
          />
        </Container>
      </section>

      <section className="py-16">
        <Container>
          <SectionTitle
            eyebrow="Featured Menu"
            title="Popular dishes your customers will notice first"
            description="This is static mock data for the client demo. Real API integration will come later."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)]"
              >
                <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
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
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}