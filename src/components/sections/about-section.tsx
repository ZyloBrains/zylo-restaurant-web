import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

type AboutSectionProps = {
    description: string;
    address: string;
};

export function AboutSection({ description, address }: AboutSectionProps) {
    return (
        <section id="about" className="py-16 md:py-20">
            <Container>
                <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
                    <SectionTitle
                        eyebrow="About"
                        title="A premium seafood experience in Kathmandu"
                        description={description}
                    />

                    <div className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]">
                        <h3
                            className="text-lg font-semibold"
                            style={{ fontFamily: "var(--font-heading, Poppins)" }}
                        >
                            Why people will love Fish Station
                        </h3>

                        <ul className="mt-4 space-y-3 text-sm text-[var(--color-text-muted)]">
                            <li>Fresh seafood prepared with bold local flavor.</li>
                            <li>Perfect for dine-in, takeaway, and delivery.</li>
                            <li>Convenient location for local Kathmandu customers.</li>
                            <li>Fast ordering through phone and WhatsApp.</li>
                        </ul>

                        <p className="mt-5 text-sm font-medium text-[var(--color-primary)]">
                            {address}
                        </p>
                    </div>
                </div>
            </Container>
        </section>
    );
}