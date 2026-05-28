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
      <section className="py-12">
        <Container>
          <div className="flex justify-center items-center h-64">
            <p className="text-lg">Loading menu...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12">
        <Container>
          <p className="text-center text-red-500">{error}</p>
        </Container>
      </section>
    );
  }

  return (
    <section
      className="py-12 relative bg-[var(--color-background)]"
      style={buildThemeStyle(tenantTheme as TenantThemeTokens)}
    >
      <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">
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
                onClick={() => router.push("/menu")}
                className="snap-start min-w-[220px] md:min-w-[260px] px-6 py-10 text-center transition duration-300 hover:-translate-y-2"
                style={{
                  background: "var(--color-surface)",
                  borderRadius: "var(--radius-card)",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="relative mx-auto h-36 w-36 md:h-40 md:w-40">
                  {item.imageUrl ? (
                    <Image
                      src={getSafeImage(item.imageUrl)}
                      alt={item.name}
                      fill
                      sizes="160px"
                      className="object-contain"
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
                rounded-full
                bg-slate-100
                text-sm
                text-slate-500
              "
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* NAME */}
                <p className="mt-6 text-lg font-semibold text-[var(--color-text)]">
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
