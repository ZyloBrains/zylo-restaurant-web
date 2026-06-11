"use client";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";
import { useServicesStore } from "@/app/[slug]/store/services-store";
import { useTenantStore } from "@/features/tenant/tenant.store";

export function ServicesSection() {
    const services = useServicesStore((s) => s.services);
    const slug = useTenantStore((s) => s.tenantSlug);

    if (!slug) return null;
    if (services.length === 0) return null;

    return (
        <section id="services" className="section-plain section-divider-top py-16 md:py-20">
            <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">
                <SectionTitle title="Services" align="center" />

                <div
                    className={`mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4 ${staggerContainer}`}
                >
                    {services.map((service, i) => (
                        <div
                            key={service.id}
                            className={`card-base card-hover flex h-full flex-col p-6 ${fadeUp}`}
                            style={{ "--stagger-index": i } as React.CSSProperties}
                        >
                            {service.iconUrl && (
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] overflow-hidden">
                                    <img
                                        src={service.iconUrl}
                                        alt={service.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            )}

                            <h3
                                className="text-lg font-semibold text-[var(--color-text)]"
                                style={{ fontFamily: "var(--font-heading, Poppins)" }}
                            >
                                {service.title}
                            </h3>

                            {service.shortDetails && (
                                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                                    {service.shortDetails}
                                </p>
                            )}

                            {service.tags && service.tags.length > 0 && (
                                <div className="mt-auto pt-5 flex flex-wrap gap-2">
                                    {service.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}