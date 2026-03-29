"use client";

import { motion } from "framer-motion";
import { UtensilsCrossed, PackageCheck, Trees, Bike } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

const services = [
    {
        title: "Dine-in",
        description:
            "Enjoy a clean, comfortable, and premium seafood dining experience.",
        icon: UtensilsCrossed,
        tag: "Comfort Dining",
    },
    {
        title: "Takeout",
        description:
            "Quick pickup for customers who want great seafood on the go.",
        icon: PackageCheck,
        tag: "Fast Pickup",
    },
    {
        title: "Outdoor Seating",
        description:
            "Relaxed seating option for customers who enjoy open-air dining.",
        icon: Trees,
        tag: "Open Air",
    },
    {
        title: "Home Delivery",
        description:
            "Fast and convenient delivery for nearby Kathmandu customers.",
        icon: Bike,
        tag: "Quick Delivery",
    },
];

export function ServicesSection() {
    return (
        <section id="services" className="py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Services"
                    title="Built around how local customers actually order"
                    description="Fish Station is designed for dine-in, quick calls, WhatsApp, takeaway, and fast delivery — all optimized for local convenience."
                />

                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4"
                >
                    {services.map((service) => {
                        const Icon = service.icon;

                        return (
                            <motion.div
                                key={service.title}
                                variants={fadeUp}
                                className="card-base card-hover flex h-full flex-col p-6"
                            >
                                {/* ICON */}
                                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-[var(--color-accent)]">
                                    <Icon className="h-6 w-6" />
                                </div>

                                {/* TITLE */}
                                <h3
                                    className="text-lg font-semibold text-[var(--color-text)]"
                                    style={{ fontFamily: "var(--font-heading, Poppins)" }}
                                >
                                    {service.title}
                                </h3>

                                {/* DESCRIPTION */}
                                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
                                    {service.description}
                                </p>

                                {/* TAG */}
                                <div className="mt-auto pt-5">
                  <span className="inline-flex rounded-full bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                    {service.tag}
                  </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </section>
    );
}