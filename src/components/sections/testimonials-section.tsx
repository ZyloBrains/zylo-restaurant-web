"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

const testimonials = [
    {
        name: "Aarav",
        role: "Seafood Lover",
        text: "Fresh taste, good portion size, and very easy to order. Perfect for seafood lovers in Kathmandu.",
    },
    {
        name: "Sita",
        role: "Regular Customer",
        text: "The grilled fish feels premium and the ordering experience is simple and fast.",
    },
    {
        name: "Rohan",
        role: "Local Food Explorer",
        text: "A restaurant like this stands out more when the website makes calling and WhatsApp ordering effortless.",
    },
];

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="section-plain section-divider-top py-16 md:py-20">
           <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">
                <SectionTitle
                   
                    title="Testimonials"
                    align="center"
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
                            className="card-base card-hover h-full p-6"
                        >
                            <div className="mb-4 flex items-center gap-1 text-amber-500">
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                                <Star className="h-4 w-4 fill-current" />
                            </div>

                            <p className="text-sm leading-7 text-[var(--color-text-muted)]">
                                “{testimonial.text}”
                            </p>

                            <div className="mt-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-[var(--color-accent)]">
                                    {testimonial.name.charAt(0)}
                                </div>

                                <div>
                                    <p className="font-semibold text-[var(--color-primary)]">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-[var(--color-text-muted)]">
                                        {testimonial.role}
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