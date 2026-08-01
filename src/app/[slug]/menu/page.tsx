'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { MenuItemView } from "@/components/menu/menu-item-view";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useMenuListStore } from "../store/menu-list-store";

function MenuPageContent() {
  const slug = useTenantStore((s) => s.tenantSlug);
  const searchParams = useSearchParams();
  const menuId = searchParams.get('menuId');
  const scrolled = useRef(false);

  const menus = useMenuListStore((s) => s.data);
  const fetchMenus = useMenuListStore((s) => s.fetchData);

  useEffect(() => {
    if (slug && menus.length === 0) fetchMenus(slug);
  }, [slug, fetchMenus, menus.length]);

  useEffect(() => {
    if (menuId && menus.length > 0 && !scrolled.current) {
      scrolled.current = true;
      const el = document.getElementById(`menu-section-${menuId}`);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, [menuId, menus]);

  if (!slug) return null;

  return <MenuItemView slug={slug} menus={menus} />;
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--color-background)]" />}>
      <MenuPageContent />
    </Suspense>
  );
}