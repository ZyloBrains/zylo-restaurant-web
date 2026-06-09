"use client";

import { useRef } from "react";

import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { MenuData } from "@/features/menu/menu.types";

import { MenuSidebar } from "./MenuSidebar";
import { useMenuScrollSpy } from "@/app/[slug]/hook/useMenuScrollSpy";
import { useGroupedMenuItems } from "@/app/[slug]/hook/useGroupedMenuItems";

type Props = {
  menu: MenuData;
};

export function MenuItemView({ menu }: Props) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { activeCategoryId, setActiveCategoryId } =
    useMenuScrollSpy(menu, sectionRefs);

  const groupedItems = useGroupedMenuItems(menu);

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);

    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const categories = menu?.categories ?? [];

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="flex">
        {/* SIDEBAR */}
        <MenuSidebar
          categories={categories}
          activeCategoryId={activeCategoryId.toString()}
          onSelect={scrollToCategory}
        />

        {/* MAIN */}
        <div className="flex-1">
          <div className="text-center py-6">
            <h1 className="text-3xl font-bold text-[var(--color-text)]">🍗 Our Menu</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Fresh food, fast service, premium taste
            </p>
          </div>

          <main className="max-w-[1200px] mx-auto px-4 py-10 space-y-16">
            {categories.map((cat) => (
              <section
                key={cat.id.toString()}
                ref={(el) => {
                  sectionRefs.current[cat.id.toString()] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">
                    {cat.categoryName}
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {cat.categoryDescription}
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {(groupedItems[cat.id.toString()] ?? []).map(
                    (item) => (
                      <MenuItemCard
                        key={item.id.toString()}
                        item={item}
                      />
                    )
                  )}
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}