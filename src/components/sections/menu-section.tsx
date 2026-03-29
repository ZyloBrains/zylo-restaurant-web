"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { MenuData } from "@/features/menu/menu.types";
import { useCart } from "@/features/cart/cart-context";

type MenuSectionProps = {
    menu: MenuData;
};

export function MenuSection({ menu }: MenuSectionProps) {
    const [activeCategoryId, setActiveCategoryId] = useState(menu.categories[0]?.id ?? "");
    const { addItem } = useCart();

    const activeCategory = menu.categories.find((c) => c.id === activeCategoryId);

    const filteredItems = useMemo(() => {
        return menu.items.filter((item) => item.categoryId === activeCategoryId);
    }, [menu.items, activeCategoryId]);

    return (
        <section id="menu" className="py-16 md:py-20">
            <Container>
                <SectionTitle
                    eyebrow="Menu"
                    title="Explore Fish Station favorites"
                    description="Built with static mock data first, so you can present the full ordering experience before backend integration."
                />

                <div className="mt-8 flex flex-wrap gap-3">
                    {menu.categories.map((category) => {
                        const active = category.id === activeCategoryId;

                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategoryId(category.id)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                    active
                                        ? "bg-[var(--color-primary)] text-white"
                                        : "border border-slate-300 bg-white text-slate-700"
                                }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {activeCategory?.description ? (
                    <p className="mt-5 text-sm text-[var(--color-text-muted)]">
                        {activeCategory.description}
                    </p>
                ) : null}

                <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="group rounded-[var(--radius-card)] border border-slate-200 bg-white p-5 shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-1"
                        >
                            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-slate-200 to-slate-100" />

                            <div className="mt-5">
                                <div className="flex items-start justify-between gap-4">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <span className="text-sm font-bold text-[var(--color-primary)]">
                    NPR {item.price}
                  </span>
                                </div>

                                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                                    {item.shortDescription}
                                </p>

                                <div className="mt-4 flex flex-wrap gap-2">
                                    {item.isSpicy ? (
                                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      Spicy
                    </span>
                                    ) : null}
                                    {item.isFeatured ? (
                                        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                      Popular
                    </span>
                                    ) : null}
                                    {item.isAvailable ? (
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      Available
                    </span>
                                    ) : null}
                                </div>

                                <button
                                    onClick={() =>
                                        addItem({
                                            menuItemId: item.id,
                                            name: item.name,
                                            price: item.price,
                                        })
                                    }
                                    className="mt-5 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}