import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { sectionImages } from "@/lib/constants/section-images";
import { MapPin, CheckCircle2 } from "lucide-react";

type AboutSectionProps = {
    description: string;
    address: string;
};

const highlights = [
    "Fresh seafood prepared with bold local flavor.",
    "Perfect for dine-in, takeaway, and delivery.",
    "Convenient location for local Kathmandu customers.",
    "Fast ordering through phone and WhatsApp.",
];

export function AboutSection({ description, address }: AboutSectionProps) {
    return (
        <section id="about" className="py-16 md:py-20">
            <Container>
                <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                    <div>
                        <SectionTitle
                            eyebrow="About"
                            title="A premium seafood experience in Kathmandu"
                            description={description}
                        />

                        <div className="mt-8 grid gap-4 sm:grid-cols-2">
                            {highlights.map((item) => (
                                <div key={item} className="card-base p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-[var(--color-accent)]">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                        <p className="text-sm leading-6 text-[var(--color-text-muted)]">
                                            {item}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div className="image-frame group relative aspect-[4/3]">
                            <img
                                src={sectionImages.about.src}
                                alt={sectionImages.about.alt}
                                loading="lazy"
                                className="image-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-900/10 to-transparent" />

                            <div className="absolute left-4 top-4 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--color-primary)] shadow-sm">
                                Fresh • Local • Premium
                            </div>
                        </div>

                        <div className="card-base p-6">
                            <h3
                                className="text-lg font-semibold text-[var(--color-text)]"
                                style={{ fontFamily: "var(--font-heading, Poppins)" }}
                            >
                                Why people will love Fish Station
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                                Fish Station brings together freshness, bold seafood flavors,
                                and a welcoming atmosphere designed for quick meals, family
                                dining, and easy ordering.
                            </p>

                            <div className="mt-5 inline-flex items-start gap-3 rounded-2xl bg-[var(--color-surface)] px-4 py-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[var(--color-accent)]">
                                    <MapPin className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                                        Location
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-[var(--color-primary)]">
                                        {address}
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