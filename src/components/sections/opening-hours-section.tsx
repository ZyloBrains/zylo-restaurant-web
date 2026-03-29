import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { OpeningHours } from "@/features/tenant/tenant.types";

type OpeningHoursSectionProps = {
    hours: OpeningHours;
};

export function OpeningHoursSection({ hours }: OpeningHoursSectionProps) {
    return (
        <section className="bg-[var(--color-surface)] py-16 md:py-20">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <SectionTitle
                        eyebrow="Opening Hours"
                        title="Open when your customers want to order"
                        description="Keep business hours visible so customers can confidently call, message, or visit."
                    />

                    <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
                        <div className="space-y-3">
                            {Object.entries(hours).map(([day, value]) => (
                                <div
                                    key={day}
                                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                                >
                                    <span className="font-medium">{day}</span>
                                    <span className="text-sm text-[var(--color-text-muted)]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}