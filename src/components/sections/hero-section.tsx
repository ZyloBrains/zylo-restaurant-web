import { Container } from "@/components/ui/container";

type HeroSectionProps = {
    restaurantName: string;
    title: string;
    subtitle: string;
    phone: string;
};

export function HeroSection({
                                restaurantName,
                                title,
                                subtitle,
                                phone,
                            }: HeroSectionProps) {
    return (
        <section
            id="top"
            className="relative overflow-hidden border-b border-slate-200 bg-[var(--color-surface)] py-20 md:py-28"
        >
            <Container>
                <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            {restaurantName}
                        </p>

                        <h1
                            className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl"
                            style={{ fontFamily: "var(--font-heading, Poppins)" }}
                        >
                            {title}
                        </h1>

                        <p className="mt-5 max-w-2xl text-base text-[var(--color-text-muted)] md:text-lg">
                            {subtitle}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a
                                href="#menu"
                                className="rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                            >
                                Order Now
                            </a>
                            <a
                                href="#menu"
                                className="rounded-[var(--radius-button)] border border-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-[var(--color-primary)]"
                            >
                                View Menu
                            </a>
                            <a
                                href={`tel:${phone}`}
                                className="rounded-[var(--radius-button)] border border-slate-300 px-5 py-3 text-sm font-semibold"
                            >
                                Call Now
                            </a>
                        </div>
                    </div>

                    <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-4 shadow-[var(--shadow-card)]">
                        <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100" />
                        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-xl bg-[var(--color-surface)] p-3">
                                <p className="text-lg font-bold text-[var(--color-primary)]">Fresh</p>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Seafood</p>
                            </div>
                            <div className="rounded-xl bg-[var(--color-surface)] p-3">
                                <p className="text-lg font-bold text-[var(--color-primary)]">Fast</p>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Ordering</p>
                            </div>
                            <div className="rounded-xl bg-[var(--color-surface)] p-3">
                                <p className="text-lg font-bold text-[var(--color-primary)]">Local</p>
                                <p className="mt-1 text-xs text-[var(--color-text-muted)]">Delivery</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}