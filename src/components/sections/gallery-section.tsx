"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";
import { sectionImages } from "@/lib/constants/section-images";

export function GallerySection() {
    return (
        <section id="gallery" className="section-mesh section-glow-both section-divider-top py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Gallery"
                    title="A visual taste of Fish Station"
                    description="Showcase signature dishes, fresh seafood plating, and restaurant ambience with a clean, premium gallery layout."
                    align="center"
                />

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {sectionImages.gallery.map((item, index) => (
                        <motion.div
                            key={item.title}
                            variants={fadeUp}
                            className={`group ${index === 0 ? "sm:col-span-2 xl:col-span-2" : ""}`}
                        >
                            <div className="image-frame relative aspect-[4/5] overflow-hidden">
                                <img
                                    src={item.src}
                                    alt={item.alt}
                                    loading="lazy"
                                    className="image-cover"
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />

                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--color-primary)] shadow-sm">
                                        Gallery Highlight
                                    </div>

                                    <h3 className="mt-3 text-lg font-semibold text-white">
                                        {item.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-200">
                                        Fresh presentation with a premium dining feel.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}