"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Filter } from "lucide-react";

import { MenuItemCard } from "@/components/menu/menu-item-card";
import type { ItemResponse, MenuResponse } from "@/features/menu/menu.types";
import { itemService } from "@/services/item.service";

import { MenuSidebar } from "./MenuSidebar";
import { useMenuScrollSpy } from "@/app/[slug]/hook/useMenuScrollSpy";

const PAGE_SIZE = 6;

type Props = {
  slug: string;
  menus: MenuResponse[];
};

export function MenuItemView({ slug, menus }: Props) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const menuIds = menus.map((m) => m.id.toString());
  const { activeId, setActiveId } = useMenuScrollSpy(menuIds, sectionRefs);

  const [itemsByMenu, setItemsByMenu] = useState<Record<string, ItemResponse[]>>({});
  const [hasMoreByMenu, setHasMoreByMenu] = useState<Record<string, boolean>>({});
  const [loadedPageByMenu, setLoadedPageByMenu] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeMenu = menus.find((m) => m.id.toString() === activeId);

  const scrollToMenu = (id: string) => {
    setActiveId(id);
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Initial load: first page (PAGE_SIZE) of top-selling items for every menu
  useEffect(() => {
    if (!slug || menus.length === 0) return;
    let cancelled = false;

    setLoading(true);
    Promise.all(
      menus.map((menu) =>
        itemService
          .getTopSellingByMenu(slug, menu.id, 0, PAGE_SIZE)
          .then((page) => {
            if (cancelled) return;
            setItemsByMenu((prev) => ({ ...prev, [menu.id]: page.content }));
            setHasMoreByMenu((prev) => ({ ...prev, [menu.id]: !page.last }));
            setLoadedPageByMenu((prev) => ({ ...prev, [menu.id]: 1 }));
          })
          .catch((err) => {
            console.error(`Failed to load top selling items for menu ${menu.id}:`, err);
            if (!cancelled) {
              setItemsByMenu((prev) => ({ ...prev, [menu.id]: [] }));
              setHasMoreByMenu((prev) => ({ ...prev, [menu.id]: false }));
            }
          })
      )
    ).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [slug, menus]);

  const loadMoreForMenu = useCallback(
    (menuId: number) => {
      if (!slug || loading) return;
      if (hasMoreByMenu[menuId] === false) return;

      setLoading(true);
      const nextPage = loadedPageByMenu[menuId] ?? 0;

      itemService
        .getTopSellingByMenu(slug, menuId, nextPage, PAGE_SIZE)
        .then((page) => {
          setItemsByMenu((prev) => ({
            ...prev,
            [menuId]: [...(prev[menuId] ?? []), ...page.content],
          }));
          setHasMoreByMenu((prev) => ({ ...prev, [menuId]: !page.last }));
          setLoadedPageByMenu((prev) => ({ ...prev, [menuId]: nextPage + 1 }));
        })
        .catch((err) => {
          console.error(`Failed to load more items for menu ${menuId}:`, err);
        })
        .finally(() => setLoading(false));
    },
    [slug, loading, hasMoreByMenu, loadedPageByMenu]
  );

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
          {/* MOBILE FILTER — direct child of flex-1 so it stays sticky for the whole page scroll */}
          <div
            className="md:hidden sticky top-14 z-20 flex flex-col items-center gap-2 px-4 py-3"
            style={{ backgroundColor: "var(--color-background)" }}
          >
            <button
              type="button"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-semibold text-[var(--color-text)] transition hover:opacity-80"
            >
              <Filter size={16} className="text-[var(--color-primary-text)]" />
              <span className="max-w-[160px] truncate">
                {activeMenu?.menuName ?? "All Menus"}
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform ${mobileMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* MOBILE MENU LIST DROPDOWN */}
            {mobileMenuOpen && (
              <div className="w-full max-w-md">
                <div
                  className="rounded-2xl border border-[var(--color-border)] p-2 shadow-[var(--shadow-card)]"
                  style={{ backgroundColor: "var(--color-surface)" }}
                >
                  <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                    {menus.map((menu) => {
                      const isActive = menu.id.toString() === activeId;
                      return (
                        <button
                          key={menu.id}
                          type="button"
                          onClick={() => {
                            scrollToMenu(menu.id.toString());
                            setMobileMenuOpen(false);
                          }}
                          className="text-left px-4 py-3 rounded-xl transition"
                          style={{
                            backgroundColor: isActive
                              ? "var(--color-primary)"
                              : "transparent",
                            color: isActive ? "#fff" : "var(--color-text)",
                          }}
                        >
                          {menu.menuName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-[var(--color-text)]">Our Menu</h1>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">
                Fresh food, fast service, premium taste
              </p>
            </div>
          </div>

          <main className="max-w-[1200px] mx-auto px-4 py-10 space-y-16">
            {menus.map((menu) => {
              const menuItems = itemsByMenu[menu.id] ?? [];
              return (
                <section
                  key={menu.id}
                  id={`menu-section-${menu.id}`}
                  ref={(el) => {
                    sectionRefs.current[menu.id] = el;
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

                  {menuItems.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {menuItems.map((item) => (
                        <MenuItemCard
                          key={item.id.toString()}
                          item={item}
                        />
                      ))}
                    </div>
                  )}

                  {loading && menuItems.length === 0 && (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="rounded-2xl bg-(--color-surface) border border-(--color-border)/40 p-5 animate-pulse"
                        >
                          <div className="aspect-[4/3] rounded-2xl bg-(--color-text-muted)/15" />
                          <div className="mt-5 space-y-2">
                            <div className="h-5 w-3/4 bg-(--color-text-muted)/20 rounded-md" />
                            <div className="h-4 w-1/2 bg-(--color-text-muted)/10 rounded-md" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {hasMoreByMenu[menu.id] && (
                    <div className="mt-8 text-center">
                      <button
                        type="button"
                        onClick={() => loadMoreForMenu(menu.id)}
                        disabled={loading}
                        className="inline-flex items-center justify-center rounded-full border-2 px-8 py-3 text-sm font-semibold transition hover:opacity-80 disabled:opacity-50"
                        style={{
                          borderColor: "var(--color-primary)",
                          color: "var(--color-primary-text)",
                          borderRadius: "var(--radius-button)",
                        }}
                      >
                        {loading ? "Loading..." : "Load More"}
                      </button>
                    </div>
                  )}
                </section>
              );
            })}
          </main>
        </div>
      </div>
    </div>
  );
}
