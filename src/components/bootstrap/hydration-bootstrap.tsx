"use client";

import { useEffect } from "react";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useMenuListStore } from "@/app/[slug]/store/menu-list-store";
import { useServicesStore } from "@/app/[slug]/store/services-store";

export function HydrationBootstrap({ slug }: { slug: string }) {
  const fetchTenant = useTenantStore((s) => s.fetchTenant);
  const fetchItems = useMenuItemStore((s) => s.fetchItems);
  const fetchMenus = useMenuListStore((s) => s.fetchMenus);
  const fetchServices = useServicesStore((s) => s.fetchServices);

  useEffect(() => {
    if (!slug) return;

    try {
      sessionStorage.setItem("active-tenant-slug", slug);
    } catch (error) {
      console.error("Failed to save active tenant slug to sessionStorage:", error);
    }

    fetchTenant(slug);
    fetchItems(slug);
    fetchMenus(slug);
    fetchServices(slug);
  }, [slug, fetchTenant, fetchItems, fetchMenus, fetchServices]);

  return null;
}
