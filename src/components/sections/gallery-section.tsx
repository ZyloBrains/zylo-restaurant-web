import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";

const galleryItems = [
    "Signature Grilled Fish",
    "Fresh Seafood Plating",
    "Restaurant Ambience",
    "Main Course Presentation",
];

export function GallerySection() {
    return (
        <section className="py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Gallery"
                    title="Visuals that make the restaurant feel real"
                    description="For client presentation, placeholders are fine now. Later these can be replaced with actual food and restaurant photos."
                />

                <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                    {galleryItems.map((item) => (
                        <div key={item} className="group">
                            <div className="aspect-[4/5] rounded-[var(--radius-card)] border border-slate-200 bg-gradient-to-br from-slate-200 to-slate-100 shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:-translate-y-1" />
                            <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}