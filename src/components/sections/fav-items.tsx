'use client';

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { MenuItemCard } from "@/components/menu/menu-item-card";

import { itemService } from "@/services/item.service";
import { CategoryService } from "@/services/category.service"; // ← Make sure this exists

import { staggerContainer } from "@/lib/utils/animations";
import type { CategoryResponse, ItemResponse } from "@/features/menu/menu.types";
import { useTenantStore } from "@/features/tenant/tenant.store";


export function FevItems() {
  const slug= useTenantStore((s)=>s.tenantSlug);
  const tenantLoading= useTenantStore((s)=>s.loading);

  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategoryId, setActiveCategoryId] = useState<string>("");

  // Fetch Categories + Items
  useEffect(() => {
    const fetchMenuData = async () => {
      if (!slug) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch both in parallel
        const [fetchedCategories, fetchedItems] = await Promise.all([
          CategoryService.getCategoryList(slug, 0, 20),
          itemService.getItemList(slug, 0, 10), // Increased size to get more items
        ]);

        setCategories(fetchedCategories);
        setItems(fetchedItems);

        // Set first category as active
        if (fetchedCategories.length > 0) {
          setActiveCategoryId(fetchedCategories[0].id.toString());
        }
      } catch (err) {
        console.error("Failed to fetch menu data:", err);
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchMenuData();
    }
  }, [slug]);

  // Active Category
  const activeCategory = useMemo(() => {
    return categories.find((cat) => cat.id.toString() === activeCategoryId);
  }, [categories, activeCategoryId]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    if (!activeCategoryId) return [];
    return items.filter((item) => item.categoryId.toString() === activeCategoryId);
  }, [items, activeCategoryId]);

  // Loading State
  if (tenantLoading || loading) {
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

  if (error) {
    return (
      <section className="section-plain section-divider-top py-16 md:py-20">
        <Container>
          <p className="text-center text-red-500">{error}</p>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="menu"
      className="section-plain section-divider-top py-16 md:py-20"
    >
      <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">
        <SectionTitle title="Favorite" align="center" />

        {/* CATEGORY BUTTONS */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const isActive = category.id.toString() === activeCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategoryId(category.id.toString())}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "border border-[var(--color-border)] bg-white text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
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
          key={activeCategoryId}
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
              <AnimatePresence mode="wait">
                {filteredItems.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}