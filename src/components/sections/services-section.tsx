"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

const services = [
    {
        title: "Dine-in",
        description:
            "Enjoy a clean, comfortable, and premium seafood dining experience.",
    },
    {
        title: "Takeout",
        description:
            "Quick pickup for customers who want great seafood on the go.",
    },
    {
        title: "Outdoor Seating",
        description:
            "Relaxed seating option for customers who enjoy open-air dining.",
    },
    {
        title: "Home Delivery",
        description:
            "Fast and convenient delivery for nearby Kathmandu customers.",
    },
];

export function ServicesSection() {
    return (
        <section id="services" className="bg-[var(--color-surface)] py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Services"
                    title="Built around how local customers actually order"
                    description="Fish Station is designed for multiple customer preferences — dine-in, quick calls, WhatsApp, takeaway, and delivery."
                />

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.title}
                            variants={fadeUp}
                            className="rounded-[var(--radius-card)] border border-slate-200 bg-white p-6 shadow-[var(--shadow-card)]"
                        >
                            <h3
                                className="text-lg font-semibold"
                                style={{ fontFamily: "var(--font-heading, Poppins)" }}
                            >
                                {service.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                                {service.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}