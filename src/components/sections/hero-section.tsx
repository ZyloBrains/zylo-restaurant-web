"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { fadeUp } from "@/lib/utils/animations";
import { sectionImages } from "@/lib/constants/section-images";

type HeroSectionProps = {
    restaurantName: string;
    title: string;
    subtitle: string;
    phone: string;
};

export function HeroSection({
                                restaurantName,
                                title,
                                subtitle,
                                phone,
                            }: HeroSectionProps) {
    return (
        <section
            id="top"
            className="relative overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0f2f52] to-[#1e3a5f] py-20 text-white md:py-28"
        >
            {/* Background glow */}
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-cyan-400 blur-[120px]" />
            </div>

            <Container>
                <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">

                    {/* LEFT CONTENT */}
                    <motion.div {...fadeUp}>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
                            {restaurantName}
                        </p>

                        <h1
                            className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl"
                            style={{ fontFamily: "var(--font-heading, Poppins)" }}
                        >
                            {title}
                        </h1>

                        <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
                            {subtitle}
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <a href="#menu" className="btn-primary">
                                Order Now
                            </a>

                            <a href="#menu" className="btn-outline-dark">
                                View Menu
                            </a>

                            <a href={`tel:${phone}`} className="btn-outline-dark">
                                Call Now
                            </a>
                        </div>
                    </motion.div>

                    {/* RIGHT IMAGE CARD */}
                    <motion.div {...fadeUp}>
                        <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/5 p-4 backdrop-blur">

                            {/* IMAGE */}
                            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                                <img
                                    src={sectionImages.hero.src}
                                    alt={sectionImages.hero.alt}
                                    loading="eager"
                                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/20 to-transparent" />

                                {/* Badge */}
                                <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
                                    Fresh Seafood Daily
                                </div>
                            </div>

                            {/* TRUST CARDS */}
                            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                                    <p className="text-lg font-bold text-cyan-300">Fresh</p>
                                    <p className="mt-1 text-xs text-slate-300">Seafood</p>
                                </div>

                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                                    <p className="text-lg font-bold text-cyan-300">Fast</p>
                                    <p className="mt-1 text-xs text-slate-300">Ordering</p>
                                </div>

                                <div className="rounded-xl bg-white/10 p-3 backdrop-blur">
                                    <p className="text-lg font-bold text-cyan-300">Local</p>
                                    <p className="mt-1 text-xs text-slate-300">Delivery</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}