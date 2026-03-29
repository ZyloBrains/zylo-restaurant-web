"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

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

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {galleryItems.map((item, index) => (
                        <motion.div key={item} variants={fadeUp} className="group">
                            <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-slate-200 shadow-[var(--shadow-card)]">
                                <img
                                    src={`/images/gallery-${index + 1}.jpg`}
                                    alt={item}
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <p className="mt-3 text-sm font-medium text-[var(--color-text-muted)]">
                                {item}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}