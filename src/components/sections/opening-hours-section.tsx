import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { OpeningHours } from "@/features/tenant/tenant.types";
import { Clock3, PhoneCall } from "lucide-react";

type OpeningHoursSectionProps = {
    hours: OpeningHours;
};

export function OpeningHoursSection({ hours }: OpeningHoursSectionProps) {
    const entries = Object.entries(hours);
    const todayIndex = new Date().getDay(); // 0 = Sunday
    const weekOrder = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    const todayName = weekOrder[todayIndex];

    return (
        <section className="section-surface py-16 md:py-20">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div>
                        <SectionTitle
                            eyebrow="Opening Hours"
                            title="Open when your customers want to order"
                            description="Keep business hours visible so customers can confidently call, message, visit, or place an order at the right time."
                        />

                        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            <Clock3 className="h-4 w-4" />
                            Open Today
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="card-base p-6">
                            <div className="space-y-3">
                                {entries.map(([day, value]) => {
                                    const isToday = day === todayName;

                                    return (
                                        <div
                                            key={day}
                                            className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition ${
                                                isToday
                                                    ? "border-[var(--color-accent)] bg-cyan-50"
                                                    : "border-slate-100 bg-white"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                        <span
                            className={`font-medium ${
                                isToday
                                    ? "text-[var(--color-primary)]"
                                    : "text-[var(--color-text)]"
                            }`}
                        >
                          {day}
                        </span>

                                                {isToday ? (
                                                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)] shadow-sm">
                            Today
                          </span>
                                                ) : null}
                                            </div>

                                            <span className="text-sm text-[var(--color-text-muted)]">
                        {value}
                      </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="card-base p-5">
                            <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-50 text-[var(--color-accent)]">
                                    <PhoneCall className="h-5 w-5" />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-[var(--color-text)]">
                                        Call before pickup
                                    </h3>
                                    <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                                        Help customers avoid waiting by encouraging a quick phone or
                                        WhatsApp confirmation before pickup or dine-in visits.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}