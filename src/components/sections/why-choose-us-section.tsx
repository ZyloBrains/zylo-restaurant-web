"use client";

import { motion } from "framer-motion";
import { Fish, PhoneCall, Flame } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

const highlights = [
    {
        title: "Fresh Seafood Daily",
        description:
            "We focus on freshness first, so every dish feels clean, flavorful, and premium.",
        icon: Fish,
    },
    {
        title: "Built for Local Convenience",
        description:
            "Easy phone orders, WhatsApp support, takeaway, and delivery for Kathmandu customers.",
        icon: PhoneCall,
    },
    {
        title: "Strong Signature Flavors",
        description:
            "Our recipes balance seafood freshness with bold, memorable local taste.",
        icon: Flame,
    },
];

export function WhyChooseUsSection() {
    return (
        <section className="section-surface py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Why Choose Us"
                    title="A seafood experience customers will remember"
                    description="This section builds trust fast by showing freshness, convenience, and signature flavor in a premium, easy-to-scan layout."
                />

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-10 grid gap-6 md:grid-cols-3"
                >
                    {highlights.map((item) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.title}
                                variants={fadeUp}
                                className="card-base card-hover h-full p-6"
                            >
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-[var(--color-accent)]">
                                    <Icon className="h-6 w-6" />
                                </div>

                                <h3
                                    className="text-lg font-semibold text-[var(--color-text)]"
                                    style={{ fontFamily: "var(--font-heading, Poppins)" }}
                                >
                                    {item.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </section>
    );
}