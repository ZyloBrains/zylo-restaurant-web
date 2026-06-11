"use client";

import { Container } from "@/components/ui/container";
import { fadeUp } from "@/lib/utils/animations";
import { sectionImages } from "@/lib/constants/section-images";
import { useEffect, useState } from "react";
import { heroImageService } from "@/services/hero-image.service";
import { HeroImageResponse } from "@/types/hero-image.types";
import { getSafeImage } from "@/lib/utils/image.utils";

type HeroSectionProps = {
    restaurantName: string;
    title: string;
    subtitle: string;
    phone: string;
    tenantSlug: string;
};

export function HeroSection({
    restaurantName,
    title,
    subtitle,
    phone,
    tenantSlug,
}: HeroSectionProps) {

    const [heroImages, setHeroImages] = useState<HeroImageResponse[]>([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!tenantSlug) return;
        heroImageService.getHeroImagesBySlug(tenantSlug).then(setHeroImages).catch(() => {});
    }, [tenantSlug]);

    const images = heroImages.length > 0
        ? heroImages.map((img) => ({
              src: getSafeImage(img.fileUrl),
              alt: img.title || `Hero image ${img.sortOrder + 1}`,
              title: img.title || null,
              description: img.description || null,
          }))
        : sectionImages.gallery;

    useEffect(() => {
        if (images.length === 0) return;
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 3500);
        return () => clearInterval(interval);
    }, [images.length]);

    const current = images[index] || images[0];

    return (
        <section
            id="top"
            className="relative overflow-hidden py-20 md:py-28 text-white"
        >

            <img
                key={current.src}
                src={current.src}
                alt={current.alt}
                className="absolute inset-0 h-full w-full object-cover animate-fade-in"
                style={{
                    transform: "translateZ(0)",
                    backfaceVisibility: "hidden",
                    willChange: "transform, opacity",
                    animationDuration: "0.9s",
                }}
                loading="eager"
            />

            <div className="absolute inset-0 bg-black/55" />

            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[var(--color-accent)] blur-[120px]" />
            </div>

            <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">

                <div className="flex items-center min-h-[70vh]">

                    <div className={`max-w-3xl ${fadeUp}`}>

                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                            {restaurantName}
                        </p>

                        <h1
                            className="text-4xl md:text-6xl font-bold tracking-tight"
                            style={{
                                fontFamily: "var(--font-heading, Poppins)",
                            }}
                        >
                            {current.title || title}
                        </h1>

                        <p className="mt-5 text-base md:text-lg text-slate-200">
                            {current.description || subtitle}
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

                    </div>

                </div>

            </Container>
        </section>
    );
}
