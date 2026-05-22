"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import type { MenuData } from "@/features/menu/menu.types";
import { MenuItemCard } from "@/components/menu/menu-item-card";

import { staggerContainer } from "@/lib/utils/animations";

type MenuSectionProps = {
  menu: MenuData;
};

export function FevItems({ menu }: MenuSectionProps) {
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
    return menu.categories.find(
      (category) => category.id === activeCategoryId
    );
  }, [menu.categories, activeCategoryId]);

  const filteredItems = useMemo(() => {
    if (!activeCategoryId) return [];
    return menu.items.filter(
      (item) => item.categoryId === activeCategoryId
    );
  }, [menu.items, activeCategoryId]);

  return (
    <section
      id="menu"
      className="section-plain section-divider-top py-16 md:py-20"
    >
      <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">
        <SectionTitle title="Favorite" align="center" />

        {/* CATEGORY BUTTONS */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
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

        {/* CATEGORY DESCRIPTION */}
        {activeCategory?.description && (
          <p className="mt-5 mx-auto max-w-2xl text-center text-sm text-[var(--color-text-muted)]">
            {activeCategory.description}
          </p>
        )}

        {/* ITEMS */}
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
                  {filteredItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </Container>
    </section>
  );
}