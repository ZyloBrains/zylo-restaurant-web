"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import type { TenantThemeTokens } from "@/features/tenant/tenant.types";

import { buildThemeStyle } from "@/lib/theme/theme.tokens";
import { SectionTitle } from "../ui/section-title";
import { Container } from "../ui/container";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { resolveImageUrl } from "@/lib/utils/image.utils";


function ExpoItemImage({ imageUrl, name }: { imageUrl?: string | null; name: string }) {
  const [error, setError] = useState(false);
  if (!imageUrl || error) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-(--color-text-muted)">
        No Image
      </div>
    );
  }
  return (
    <img
      src={resolveImageUrl(imageUrl)}
      alt={name}
      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      onError={() => setError(true)}
    />
  );
}

export default function ExpoMenu() {
  const tenantTheme = useTenantStore((s) => s.tenantTheme);
  const items = useMenuItemStore((s) => s.items);
  const initialized = useMenuItemStore((s) => s.initialized);
  const storeLoading = useMenuItemStore((s) => s.loading);

  const router = useRouter();
  if (!initialized && storeLoading) {
    return (
      <section className="py-12 bg-(--color-background)">
        <Container className="max-w-385 px-3 lg:px-4 xl:px-6">
          <div className="mb-8 flex justify-center">
            <div className="h-8 w-48 bg-(--color-text-muted)/20 rounded-full animate-pulse" />
          </div>
          <div className="flex gap-8 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="min-w-55 md:min-w-65 px-4 py-6 animate-pulse"
              >
                <div className="w-full aspect-square rounded-2xl bg-(--color-text-muted)/15" />
                <div className="mt-5 h-5 w-3/4 mx-auto bg-(--color-text-muted)/20 rounded-full" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (!initialized || items.length === 0) {
    return null;
  }

  return (
    <section
      className="py-12 relative bg-(--color-background)"
      style={buildThemeStyle(tenantTheme as TenantThemeTokens)}
    >
      <Container className="relative max-w-385 px-3 lg:px-4 xl:px-6">
        {/* TITLE */}
        <div className="mb-8">
          <SectionTitle title="Explore Menu" align="center" />
        </div>

        {/* ITEMS SLIDER */}
        <div className="relative">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(`/menu/${item.id}`)}
                className="snap-start min-w-55 md:min-w-65 px-4 py-6 text-center transition duration-300 hover:-translate-y-2"
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="relative mx-auto w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] shadow-inner">
                  <ExpoItemImage imageUrl={item.imageUrl} name={item.name} />
                </div>

                {/* NAME */}
                <p className="mt-5 text-lg font-semibold text-(--color-text)">
                  {item.name}
                </p>
              </button>
            ))}
          </div>

          {/* LEFT FADE */}
          <div
            className="pointer-events-none absolute left-0 top-0 h-full w-12"
            style={{
              background:
                "linear-gradient(to right, var(--color-background), transparent)",
            }}
          />

          {/* RIGHT FADE */}
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-12"
            style={{
              background:
                "linear-gradient(to left, var(--color-background), transparent)",
            }}
          />
        </div>
      </Container>
    </section>
  );
}
