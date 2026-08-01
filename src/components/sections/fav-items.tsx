'use client';

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/ui/container";
import { SectionTitle } from "@/components/ui/section-title";
import { MenuItemCard } from "@/components/menu/menu-item-card";

import { staggerContainer } from "@/lib/utils/animations";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useTenantStore } from "@/features/tenant/tenant.store";

const TOP_SELLING_LIMIT = 6;

export function FevItems() {
  const slug = useTenantStore((s) => s.tenantSlug);

  const topSellingItems = useMenuItemStore((s) => s.topSellingItems);
  const topSellingInitialized = useMenuItemStore((s) => s.topSellingInitialized);
  const topSellingLoading = useMenuItemStore((s) => s.topSellingLoading);
  const fetchTopSellingItems = useMenuItemStore((s) => s.fetchTopSellingItems);

  useEffect(() => {
    if (slug && !topSellingInitialized && !topSellingLoading) {
      fetchTopSellingItems(slug, TOP_SELLING_LIMIT);
    }
  }, [slug, fetchTopSellingItems, topSellingInitialized, topSellingLoading]);

  const loading = !topSellingInitialized && topSellingLoading;
  const displayItems = topSellingItems.slice(0, TOP_SELLING_LIMIT);

  if (loading) {
    return (
      <section className="section-plain section-divider-top py-16 md:py-20">
        <Container className="max-w-385 px-3 lg:px-4 xl:px-6">
          <div className="mb-8 flex justify-center">
            <div className="h-8 w-40 bg-(--color-text-muted)/20 rounded-full animate-pulse" />
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

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <section
      id="menu"
      className="section-plain section-divider-top py-16 md:py-20"
    >
      <Container className="relative max-w-385 px-3 lg:px-4 xl:px-6">
        <SectionTitle title="Top Selling" align="center" />

        {/* ITEMS GRID */}
        <div className={`mt-10 ${staggerContainer}`}>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {displayItems.map((item, i) => (
              <div key={item.id} className="h-full" style={{ "--stagger-index": i } as React.CSSProperties}>
                <MenuItemCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* ALL ITEMS BUTTON */}
        <div className="mt-10 flex justify-end">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full border-2 px-6 py-3 text-sm font-semibold transition hover:opacity-80"
            style={{
              borderColor: "var(--color-primary)",
              color: "var(--color-primary-text)",
              borderRadius: "var(--radius-button)",
            }}
          >
            All Items
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
