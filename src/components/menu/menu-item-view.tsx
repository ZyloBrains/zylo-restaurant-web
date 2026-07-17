"use client";

import { useRef } from "react";

import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { ItemResponse, MenuResponse } from "@/features/menu/menu.types";

import { MenuSidebar } from "./MenuSidebar";
import { useMenuScrollSpy } from "@/app/[slug]/hook/useMenuScrollSpy";
import { useGroupedMenuItems } from "@/app/[slug]/hook/useGroupedMenuItems";

type Props = {
  items: ItemResponse[];
  menus: MenuResponse[];
};

export function MenuItemView({ items, menus }: Props) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const menuIds = menus.map((m) => m.id.toString());
  const { activeId, setActiveId } = useMenuScrollSpy(menuIds, sectionRefs);

  const groupedItems = useGroupedMenuItems(items);

  const scrollToMenu = (id: string) => {
    setActiveId(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="flex">
        {/* SIDEBAR */}
        <MenuSidebar
          menus={menus}
          activeMenuId={activeId}
          onSelect={scrollToMenu}
        />

        {/* MAIN */}
        <div className="flex-1">
          <div className="text-center py-6">
            <h1 className="text-3xl font-bold text-[var(--color-text)]">Our Menu</h1>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              Fresh food, fast service, premium taste
            </p>
          </div>

          <main className="max-w-[1200px] mx-auto px-4 py-10 space-y-16">
            {menus.map((menu) => (
              <section
                key={menu.id.toString()}
                id={`menu-section-${menu.id}`}
                ref={(el) => {
                  sectionRefs.current[menu.id.toString()] = el;
                }}
                className="scroll-mt-24"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold">{menu.menuName}</h2>
                  {menu.description && (
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {menu.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {(groupedItems[menu.id.toString()] ?? []).map(
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