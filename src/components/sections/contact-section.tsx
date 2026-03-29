"use client";

import { PhoneCall, MessageCircle, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

type ContactSectionProps = {
    phone: string;
    whatsappNumber: string;
    email: string;
    address: string;
    mapsUrl: string;
};

export function ContactSection({
                                   phone,
                                   whatsappNumber,
                                   email,
                                   address,
                                   mapsUrl,
                               }: ContactSectionProps) {
    return (
        <section id="contact" className="section-soft-gradient bg-soft-pattern section-divider-top py-16 md:py-20">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">

                    {/* LEFT SIDE */}
                    <div>
                        <SectionTitle
                            eyebrow="Contact"
                            title="Make it easy for customers to reach you"
                            description="Phone and WhatsApp should always be fast, visible, and thumb-friendly for Kathmandu customers."
                        />

                        <div className="mt-8 space-y-4">

                            {/* CALL BUTTON */}
                            <a href={`tel:${phone}`} className="btn-primary w-full gap-2">
                                <PhoneCall className="h-4 w-4" />
                                Call {phone}
                            </a>

                            {/* WHATSAPP BUTTON */}
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-secondary w-full gap-2"
                            >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp Us
                            </a>

                            {/* INFO CARD */}
                            <div className="card-base space-y-4 p-5">

                                {/* ADDRESS */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[var(--color-accent)]">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                                            Address
                                        </p>
                                        <p className="mt-1 text-sm text-[var(--color-text)]">
                                            {address}
                                        </p>
                                    </div>
                                </div>

                                {/* EMAIL */}
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[var(--color-accent)]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                                            Email
                                        </p>
                                        <p className="mt-1 text-sm text-[var(--color-text)]">
                                            {email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* SUPPORT NOTE */}
                            <div className="rounded-2xl bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
                                Tip: Call or message before visiting for faster service and availability.
                            </div>
                        </div>
                    </div>

                    {/* MAP */}
                    <div className="card-base p-3">
                        <iframe
                            src={mapsUrl}
                            className="h-[380px] w-full rounded-2xl border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}