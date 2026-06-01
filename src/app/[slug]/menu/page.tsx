'use client';

import { MenuItemView } from "@/components/menu/menu-item-view";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useMenuCategoryStore } from "../store/menu-category-store";
import { useMenuItemStore } from "../store/menu-store";


export default function MenuPage() {
  const slug=useTenantStore((s)=>s.tenantSlug);
  const categories= useMenuCategoryStore((s)=>s.categories);
  const items= useMenuItemStore((s)=>s.items);


  return <MenuItemView menu={{ categories,items }} />;
}