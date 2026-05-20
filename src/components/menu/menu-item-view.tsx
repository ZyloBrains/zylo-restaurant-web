"use client";

import { useRef } from "react";
import { AnimatePresence } from "framer-motion";

import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { MenuData } from "@/features/menu/menu.types";

import { MenuSidebar } from "./MenuSidebar";
import { useMenuScrollSpy } from "@/app/hook/useMenuScrollSpy";
import { useGroupedMenuItems } from "@/app/hook/useGroupedMenuItems";

type Props = {
  menu: MenuData;
};

export function MenuItemView({ menu }: Props) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const { activeCategoryId, setActiveCategoryId } = useMenuScrollSpy(
    menu,
    sectionRefs
  );

  const groupedItems = useGroupedMenuItems(menu);

  const scrollToCategory = (id: string) => {
    setActiveCategoryId(id);

    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        {/* SIDEBAR */}
        <MenuSidebar
          categories={menu.categories}
          activeCategoryId={activeCategoryId}
          onSelect={scrollToCategory}
        />

        {/* MAIN */}
        <div className="flex-1">
          {/* HEADER */}
          <div className="text-center py-6">
            <h1 className="text-3xl font-bold">🍗 Our Menu</h1>
            <p className="text-gray-500 text-sm mt-1">
              Fresh food, fast service, premium taste
            </p>
          </div>

          {/* SECTIONS */}
          <main className="max-w-[1200px] mx-auto px-4 py-10 space-y-16">
            {menu.categories.map((cat) => (
              <section
                key={cat.id}
                ref={(el) => {
                  sectionRefs.current[cat.id] = el;
                }}
                className="scroll-mt-24"
              >
                {/* CATEGORY HEADER */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{cat.name}</h2>
                  <p className="text-sm text-gray-500">
                    {cat.description}
                  </p>
                </div>

                {/* ITEMS GRID */}
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  <AnimatePresence mode="wait">
                    {groupedItems[cat.id]?.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            ))}
          </main>
        </div>
      </div>
    </div>
  );
}