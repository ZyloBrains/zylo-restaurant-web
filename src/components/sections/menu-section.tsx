"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { MenuData, MenuItem } from "@/features/menu/menu.types";
import { useCart } from "@/features/cart/cart-context";
import { fadeUp, staggerContainer } from "@/lib/utils/animations";

type MenuSectionProps = {
    menu: MenuData;
};

function getSafeImage(src?: string): string {
    if (!src || src.trim() === "") {
        return "/images/placeholder-food.jpg";
    }

    if (src.startsWith("http://") || src.startsWith("https://")) {
        return src;
    }

    if (!src.startsWith("/")) {
        return `/${src}`;
    }

    return src;
}

export function MenuSection({ menu }: MenuSectionProps) {
    const { addItem, getItemQty } = useCart();
    const [activeCategoryId, setActiveCategoryId] = useState<string>("");

    useEffect(() => {
        if (!menu?.categories?.length) {
            setActiveCategoryId("");
            return;
        }

        const activeStillExists = menu.categories.some(
            (category) => category.id === activeCategoryId
        );

        if (!activeStillExists) {
            setActiveCategoryId(menu.categories[0].id);
        }
    }, [menu, activeCategoryId]);

    const activeCategory = useMemo(() => {
        return menu.categories.find((category) => category.id === activeCategoryId);
    }, [menu.categories, activeCategoryId]);

    const filteredItems = useMemo(() => {
        if (!activeCategoryId) return [];
        return menu.items.filter((item) => item.categoryId === activeCategoryId);
    }, [menu.items, activeCategoryId]);

    const showAddToCartToast = (item: MenuItem, qtyInCartAfterAdd: number) => {
        toast.custom(
            () => (
                <div className="flex w-[340px] items-center gap-3 rounded-2xl border border-white/10 bg-white p-3 shadow-xl">
                    <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gray-100">
                        <Image
                            src={getSafeImage(item.imageUrl)}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="56px"
                        />
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                            {item.name} added to cart
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Qty in cart: {qtyInCartAfterAdd}
                        </p>
                    </div>

                    <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        NPR {item.price}
                    </div>
                </div>
            ),
            { duration: 2200 }
        );
    };

    const handleAddToCart = (item: MenuItem, currentQty: number) => {
        addItem({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            imageUrl: item.imageUrl,
            isSpicy: item.isSpicy,
            isFeatured: item.isFeatured,
        });

        showAddToCartToast(item, currentQty + 1);
    };

    return (
        <section
            id="menu"
            className="section-plain section-divider-top py-16 md:py-20"
        >
            <Container>
                <SectionTitle
                    eyebrow="Menu"
                    title="Explore Fish Station favorites"
                    description="Browse categories, discover popular dishes, and order instantly with a smooth, mobile-first experience."
                />

                <div className="mt-8 flex flex-wrap gap-3">
                    {menu.categories.map((category) => {
                        const isActive = category.id === activeCategoryId;

                        return (
                            <button
                                key={category.id}
                                type="button"
                                onClick={() => setActiveCategoryId(category.id)}
                                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                                    isActive
                                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                                        : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                                }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {activeCategory?.description && (
                    <p className="mt-5 max-w-2xl text-sm text-[var(--color-text-muted)]">
                        {activeCategory.description}
                    </p>
                )}

                {!!menu.categories.length && (
                    <motion.div
                        key={activeCategoryId}
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                        className="mt-10"
                    >
                        {filteredItems.length === 0 ? (
                            <p className="text-sm text-[var(--color-text-muted)]">
                                No items available in this category.
                            </p>
                        ) : (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                <AnimatePresence mode="wait">
                                    {filteredItems.map((item) => {
                                        const qtyInCart = getItemQty(item.id);

                                        return (
                                            <motion.div
                                                key={`${activeCategoryId}-${item.id}`}
                                                variants={fadeUp}
                                                initial="initial"
                                                animate="animate"
                                                exit={{ opacity: 0, y: 10 }}
                                                className="card-base card-hover group p-5"
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                                                    <Image
                                                        src={getSafeImage(item.imageUrl)}
                                                        alt={item.name}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                        className="object-cover transition duration-300 group-hover:scale-[1.03]"
                                                    />

                                                    {qtyInCart > 0 && (
                                                        <div className="absolute right-3 top-3 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow-md">
                                                            {qtyInCart} in cart
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-5">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <h3 className="text-lg font-semibold text-[var(--color-text)]">
                                                            {item.name}
                                                        </h3>

                                                        <span className="text-sm font-bold text-[var(--color-primary)]">
                              NPR {item.price}
                            </span>
                                                    </div>

                                                    <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                                                        {item.shortDescription}
                                                    </p>

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

                                                        {item.isAvailable ? (
                                                            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                ✔ Available
                              </span>
                                                        ) : (
                                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                                Unavailable
                              </span>
                                                        )}
                                                    </div>

                                                    <div className="mt-5 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleAddToCart(item, qtyInCart)}
                                                            className="btn-primary w-full sm:w-auto"
                                                            disabled={!item.isAvailable}
                                                        >
                                                            {qtyInCart > 0 ? "Add One More" : "Add to Cart"}
                                                        </button>

                                                        {qtyInCart > 0 && (
                                                            <span className="text-sm font-medium text-[var(--color-text-muted)]">
                                Qty: {qtyInCart}
                              </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}
            </Container>
        </section>
    );
}