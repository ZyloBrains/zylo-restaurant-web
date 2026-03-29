"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { MenuData } from "@/features/menu/menu.types";
import { useCart } from "@/features/cart/cart-context";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

type MenuSectionProps = {
    menu: MenuData;
};

export function MenuSection({ menu }: MenuSectionProps) {
    const [activeCategoryId, setActiveCategoryId] = useState(
        menu.categories[0]?.id ?? ""
    );
    const { addItem } = useCart();

    const activeCategory = menu.categories.find(
        (c) => c.id === activeCategoryId
    );

    const filteredItems = useMemo(() => {
        return menu.items.filter(
            (item) => item.categoryId === activeCategoryId
        );
    }, [menu.items, activeCategoryId]);

    return (
        <section id="menu" className="section-plain section-divider-top py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Menu"
                    title="Explore Fish Station favorites"
                    description="Browse categories, discover popular dishes, and order instantly with a smooth, mobile-first experience."
                />

                {/* CATEGORY PILLS */}
                <div className="mt-8 flex flex-wrap gap-3">
                    {menu.categories.map((category) => {
                        const active = category.id === activeCategoryId;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategoryId(category.id)}
                                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                                    active
                                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                                        : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* CATEGORY DESCRIPTION */}
                {activeCategory?.description && (
                    <p className="mt-5 max-w-2xl text-sm text-[var(--color-text-muted)]">
                        {activeCategory.description}
                    </p>
                )}

                {/* ITEMS GRID */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.15 }}
                    className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item.id}
                            variants={fadeUp}
                            className="card-base card-hover group p-5"
                        >
                            {/* IMAGE */}
                            <div className="image-frame aspect-[4/3]">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    loading="lazy"
                                    className="image-cover"
                                />
                            </div>

                            <div className="mt-5">
                                {/* TITLE + PRICE */}
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-lg font-semibold text-[var(--color-text)]">
                                        {item.name}
                                    </h3>

                                    <span className="text-sm font-bold text-[var(--color-primary)]">
                    NPR {item.price}
                  </span>
                                </div>

                                {/* DESCRIPTION */}
                                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                                    {item.shortDescription}
                                </p>

                                {/* TAGS */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.isSpicy && (
                                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      🌶 Spicy
                    </span>
                                    )}

                                    {item.isFeatured && (
                                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      ⭐ Popular
                    </span>
                                    )}

                                    {item.isAvailable && (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      ✔ Available
                    </span>
                                    )}
                                </div>

                                {/* CTA */}
                                <button
                                    onClick={() =>
                                        addItem({
                                            menuItemId: item.id,
                                            name: item.name,
                                            price: item.price,
                                        })
                                    }
                                    className="btn-primary mt-5 w-full sm:w-auto"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </section>
    );
}