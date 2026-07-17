'use client';

import { useEffect, useMemo, useState } from "react";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { MenuItemCard } from "@/components/menu/menu-item-card";

import { staggerContainer } from "@/lib/utils/animations";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useMenuListStore } from "@/app/[slug]/store/menu-list-store";
import { useTenantStore } from "@/features/tenant/tenant.store";


export function FevItems() {
  const slug = useTenantStore((s) => s.tenantSlug);
  const menus = useMenuListStore((s) => s.menus);
  const menusInitialized = useMenuListStore((s) => s.initialized);
  const menusLoading = useMenuListStore((s) => s.loading);

  const topSellingItems = useMenuItemStore((s) => s.topSellingItems);
  const topSellingInitialized = useMenuItemStore((s) => s.topSellingInitialized);
  const topSellingLoading = useMenuItemStore((s) => s.topSellingLoading);
  const fetchTopSellingItems = useMenuItemStore((s) => s.fetchTopSellingItems);

  const [activeMenuId, setActiveMenuId] = useState<string>("");

  useEffect(() => {
    if (slug && !topSellingInitialized && !topSellingLoading) {
      fetchTopSellingItems(slug, 5);
    }
  }, [slug, fetchTopSellingItems, topSellingInitialized, topSellingLoading]);

  const currentMenuId = activeMenuId || "";

  const activeMenu = useMemo(() => {
    if (!currentMenuId) return undefined;
    return menus.find((m) => m.id.toString() === currentMenuId);
  }, [menus, currentMenuId]);

  const filteredItems = useMemo(() => {
    if (!currentMenuId) return topSellingItems;
    return topSellingItems.filter((item) => item.menuId?.toString() === currentMenuId);
  }, [topSellingItems, currentMenuId]);

  const loading = (!menusInitialized && menusLoading) || (!topSellingInitialized && topSellingLoading);

  if (loading) {
    return (
      <section className="section-plain section-divider-top py-16 md:py-20">
        <Container className="max-w-385 px-3 lg:px-4 xl:px-6">
          <div className="mb-8 flex justify-center">
            <div className="h-8 w-40 bg-(--color-text-muted)/20 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-3 justify-center mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-24 bg-(--color-text-muted)/15 rounded-full animate-pulse" />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-(--color-surface) border border-(--color-border)/40 p-5 animate-pulse">
                <div className="aspect-[4/3] rounded-2xl bg-(--color-text-muted)/15" />
                <div className="mt-5 space-y-2">
                  <div className="h-5 w-3/4 bg-(--color-text-muted)/20 rounded-md" />
                  <div className="h-4 w-1/2 bg-(--color-text-muted)/10 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (menus.length === 0) {
    return null;
  }

  return (
    <section
      id="menu"
      className="section-plain section-divider-top py-16 md:py-20"
    >
      <Container className="relative max-w-385 px-3 lg:px-4 xl:px-6">
        <SectionTitle title="Favorite" align="center" />

        {/* MENU BUTTONS */}
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {/* ALL button */}
          <button
            type="button"
            onClick={() => setActiveMenuId("")}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
              !currentMenuId
                ? "bg-[var(--color-primary)] text-white shadow-sm"
                : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
            }`}
          >
            All
          </button>

          {menus.map((menu) => {
            const isActive = menu.id.toString() === currentMenuId;

            return (
              <button
                key={menu.id}
                type="button"
                onClick={() => setActiveMenuId(menu.id.toString())}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                }`}
              >
                {menu.menuName}
              </button>
            );
          })}
        </div>

        {/* MENU DESCRIPTION */}
        {activeMenu?.description && (
          <p className="mt-5 mx-auto max-w-2xl text-center text-sm text-[var(--color-text-muted)]">
            {activeMenu.description}
          </p>
        )}

        {/* ITEMS GRID */}
        <div
          key={currentMenuId}
          className={`mt-10 ${staggerContainer}`}
        >
          {filteredItems.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-10">
              No items available in this menu.
            </p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item, i) => (
                <div key={item.id} style={{ "--stagger-index": i } as React.CSSProperties}>
                  <MenuItemCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}