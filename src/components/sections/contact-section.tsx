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
        <section id="contact" className="py-16 md:py-20">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
                    <div>
                        <SectionTitle
                            eyebrow="Contact"
                            title="Make it easy for customers to reach you"
                            description="For the Nepal market, phone and WhatsApp should always be fast, visible, and thumb-friendly."
                        />

                        <div className="mt-8 space-y-4">
                            <a
                                href={`tel:${phone}`}
                                className="block rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-4 text-center font-semibold text-white"
                            >
                                Call {phone}
                            </a>

                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-[var(--radius-button)] border border-[var(--color-primary)] px-5 py-4 text-center font-semibold text-[var(--color-primary)]"
                            >
                                WhatsApp Us
                            </a>

                            <div className="rounded-[var(--radius-card)] border border-slate-200 p-5 shadow-[var(--shadow-card)]">
                                <p className="text-sm font-semibold text-[var(--color-primary)]">Address</p>
                                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{address}</p>

                                <p className="mt-4 text-sm font-semibold text-[var(--color-primary)]">Email</p>
                                <p className="mt-2 text-sm text-[var(--color-text-muted)]">{email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-3 shadow-[var(--shadow-card)]">
                        <iframe
                            src={mapsUrl}
                            className="h-[380px] w-full rounded-2xl"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}