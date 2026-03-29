"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

const highlights = [
    {
        title: "Fresh Seafood Daily",
        description:
            "We focus on freshness first, so every dish feels clean, flavorful, and premium.",
    },
    {
        title: "Built for Local Convenience",
        description:
            "Easy phone orders, WhatsApp support, takeaway, and delivery for Kathmandu customers.",
    },
    {
        title: "Strong Signature Flavors",
        description:
            "Our recipes balance seafood freshness with bold, memorable local taste.",
    },
];

export function WhyChooseUsSection() {
    return (
        <section className="py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Why Choose Us"
                    title="A seafood experience customers will remember"
                    description="This section helps clients understand the business value the website is communicating to visitors."
                />

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-10 grid gap-6 md:grid-cols-3"
                >
                    {highlights.map((item) => (
                        <motion.div
                            key={item.title}
                            variants={fadeUp}
                            className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]"
                        >
                            <div className="mb-4 h-12 w-12 rounded-2xl bg-[var(--color-surface)]" />
                            <h3
                                className="text-lg font-semibold"
                                style={{ fontFamily: "var(--font-heading, Poppins)" }}
                            >
                                {item.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}