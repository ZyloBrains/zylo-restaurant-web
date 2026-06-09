'use client';

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { MenuItemCard } from "@/components/menu/menu-item-card";

import { staggerContainer } from "@/lib/utils/animations";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useMenuCategoryStore } from "@/app/[slug]/store/menu-category-store";


export function FevItems() {
  const categories = useMenuCategoryStore((s) => s.categories);
  const catInitialized = useMenuCategoryStore((s) => s.initialized);
  const catLoading = useMenuCategoryStore((s) => s.loading);

  const items = useMenuItemStore((s) => s.items);
  const itemInitialized = useMenuItemStore((s) => s.initialized);
  const itemLoading = useMenuItemStore((s) => s.loading);

  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  const currentCategoryId = activeCategoryId || "";

  const activeCategory = useMemo(() => {
    if (!currentCategoryId) return undefined;
    return categories.find((cat) => cat.id.toString() === currentCategoryId);
  }, [categories, currentCategoryId]);

  const filteredItems = useMemo(() => {
    if (!currentCategoryId) return items;
    return items.filter((item) => item.categoryId.toString() === currentCategoryId);
  }, [items, currentCategoryId]);

  const loading = (!catInitialized && catLoading) || (!itemInitialized && itemLoading);

  if (loading) {
    return (
      <section className="section-plain section-divider-top py-16 md:py-20">
        <Container>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading favorite items...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      id="menu"
      className="section-plain section-divider-top py-16 md:py-20"
    >
      <Container className="relative max-w-385 px-3 lg:px-4 xl:px-6">
        <SectionTitle title="Favorite" align="center" />

        {/* CATEGORY BUTTONS */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {/* ALL button */}
          <button
            type="button"
            onClick={() => setActiveCategoryId("")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              !currentCategoryId
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
          >
            All
          </button>

          {categories.map((category) => {
            const isActive = category.id.toString() === currentCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id.toString())}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {category.categoryName}
              </button>
            );
          })}
        </div>

        {/* CATEGORY DESCRIPTION */}
        {activeCategory?.categoryDescription && (
          <p className="mt-5 mx-auto max-w-2xl text-center text-sm text-[var(--color-text-muted)]">
            {activeCategory.categoryDescription}
          </p>
        )}

        {/* ITEMS GRID */}
        <motion.div
          key={currentCategoryId}
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mt-10"
        >
          {filteredItems.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-10">
              No items available in this category.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}