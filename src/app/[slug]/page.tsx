"use client";

import { useEffect } from "react";
import { MenuClientShell } from "@/components/sections/menu-client-shell";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useMenuCategoryStore } from "@/app/[slug]/store/menu-category-store";
import { buildThemeStyle } from "@/lib/theme/theme.tokens";
import { TenantTheme } from "@/types/tenant.types";

export default function TenantHome() {
  const tenantTheme = useTenantStore((s) => s.tenantTheme);
  const slug = useTenantStore((s) => s.tenantSlug);
  const fetchItems = useMenuItemStore((s) => s.fetchItems);
  const items = useMenuItemStore((s) => s.items);
  const fetchCategories = useMenuCategoryStore((s) => s.fetchCategories);
  const categories = useMenuCategoryStore((s) => s.categories);

  useEffect(() => {
    if (slug && items.length === 0) fetchItems(slug);
  }, [slug, fetchItems, items.length]);

  useEffect(() => {
    if (slug && categories.length === 0) fetchCategories(slug);
  }, [slug, fetchCategories, categories.length]);

  const themeStyle = buildThemeStyle(tenantTheme as TenantTheme);

  return (
    <div
      className="min-h-screen pb-24 md:pb-0"
      style={{
        ...themeStyle,
        fontFamily: "var(--font-body, Inter, sans-serif)",
        backgroundColor: "var(--color-background)",
        color: "var(--color-text)",
      }}
    >
      <MenuClientShell />
    </div>
  );
}
