'use client';

import { useEffect } from 'react';
import { MenuItemView } from "@/components/menu/menu-item-view";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useMenuCategoryStore } from "../store/menu-category-store";
import { useMenuItemStore } from "../store/menu-store";


export default function MenuPage() {
  const slug=useTenantStore((s)=>s.tenantSlug);
  const categories= useMenuCategoryStore((s)=>s.categories);
  const items= useMenuItemStore((s)=>s.items);
  const fetchItems = useMenuItemStore((s) => s.fetchItems);
  const fetchCategories = useMenuCategoryStore((s) => s.fetchCategories);

  useEffect(() => {
    if (slug && items.length === 0) fetchItems(slug);
  }, [slug, fetchItems, items.length]);

  useEffect(() => {
    if (slug && categories.length === 0) fetchCategories(slug);
  }, [slug, fetchCategories, categories.length]);

  return <MenuItemView menu={{ categories,items }} />;
}