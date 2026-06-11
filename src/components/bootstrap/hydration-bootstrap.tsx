"use client";

import { useEffect } from "react";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useMenuCategoryStore } from "@/app/[slug]/store/menu-category-store";
import { useServicesStore } from "@/app/[slug]/store/services-store";

export function HydrationBootstrap({ slug }: { slug: string }) {
  const fetchTenant = useTenantStore((s) => s.fetchTenant);
  const fetchItems = useMenuItemStore((s) => s.fetchItems);
  const fetchCategories = useMenuCategoryStore((s) => s.fetchCategories);
  const fetchServices = useServicesStore((s) => s.fetchServices);

  useEffect(() => {
    if (!slug) return;
    fetchTenant(slug);
    fetchItems(slug);
    fetchCategories(slug);
    fetchServices(slug);
  }, [slug, fetchTenant, fetchItems, fetchCategories, fetchServices]);

  return null;
}
