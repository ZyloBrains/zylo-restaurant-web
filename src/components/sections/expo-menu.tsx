import Image from "next/image";
import { useRouter } from "next/navigation";

import { ItemResponse } from "@/features/menu/menu.types";
import type { TenantThemeTokens } from "@/features/tenant/tenant.types";

import { buildThemeStyle } from "@/lib/theme/theme.tokens";
import { SectionTitle } from "../ui/section-title";
import { Container } from "../ui/container";
import { useEffect, useState } from "react";
import { itemService } from "@/services/item.service";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { p } from "framer-motion/client";
import { getSafeImage } from "@/lib/utils/image.utils";


export default function ExpoMenu() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const slug = useTenantStore((s) => s.tenantSlug);
  const tenantTheme = useTenantStore((s) => s.tenantTheme);
  const tenantLoading = useTenantStore((s) => s.loading);

  const router = useRouter();

  const [items, setItems] = useState<ItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      
      if (!slug) return;
      setLoading(true);
      setError(null);
      console.log("The base url is: ",BASE_URL);
      try {
        const fetchItems = await itemService.getItemList(slug, 0, 10);
        setItems(fetchItems);
      } catch (err) {
        console.error("Failed to fetch menu items: ", err);
        setError("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchItems();
    }
  }, [slug]);

  if (tenantLoading || loading) {
    return (
      <section className="py-12 bg-(--color-background)">
        <Container>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-(--color-text-muted)">Loading menu...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-(--color-background)">
        <Container>
          <p className="text-center text-red-500">{error}</p>
        </Container>
      </section>
    );
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
                onClick={() => router.push(`/${slug}/menu/${item.id}`)}
                className="snap-start min-w-55 md:min-w-65 px-4 py-6 text-center transition duration-300 hover:-translate-y-2"
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="relative mx-auto w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] shadow-inner">
                  {item.imageUrl ? (
                    <Image
                      src={getSafeImage(item.imageUrl)}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 260px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div
                      className="
                h-full
                w-full
                flex
                items-center
                justify-center
                text-sm
                text-(--color-text-muted)
              "
                    >
                      No Image
                    </div>
                  )}
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
