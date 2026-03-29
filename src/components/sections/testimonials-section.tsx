"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

const testimonials = [
    {
        name: "Aarav",
        text: "Fresh taste, good portion size, and very easy to order. Perfect for seafood lovers in Kathmandu.",
    },
    {
        name: "Sita",
        text: "The grilled fish feels premium and the ordering experience is simple and fast.",
    },
    {
        name: "Rohan",
        text: "A restaurant like this stands out more when the website makes calling and WhatsApp ordering effortless.",
    },
];

export function TestimonialsSection() {
    return (
        <section className="bg-[var(--color-surface)] py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Testimonials"
                    title="Build trust before the customer even visits"
                    description="Testimonials or trust indicators make the demo feel more complete and business-ready."
                />

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-10 grid gap-6 md:grid-cols-3"
                >
                    {testimonials.map((testimonial) => (
                        <motion.div
                            key={testimonial.name}
                            variants={fadeUp}
                            className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]"
                        >
                            <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                                “{testimonial.text}”
                            </p>
                            <p className="mt-5 font-semibold text-[var(--color-primary)]">
                                {testimonial.name}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}