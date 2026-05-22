
import Image from "next/image";
import { useRouter } from "next/navigation";

import type { MenuData } from "@/features/menu/menu.types";
import type { TenantThemeTokens } from "@/features/tenant/tenant.types";

import { buildThemeStyle } from "@/lib/theme/theme.tokens";
import { SectionTitle } from "../ui/section-title";
import { Container } from "../ui/container";

type Props = {
  menu: MenuData;
  theme: TenantThemeTokens;
};

function getSafeImage(src?: string) {
  if (!src || src.trim() === "") return "/images/placeholder-food.jpg";
  if (src.startsWith("http")) return src;
  if (!src.startsWith("/")) return `/${src}`;
  return src;
}

export default function ExpoMenu({ menu, theme }: Props) {
  const router = useRouter();
  const items = menu.items.slice(0, 10);

  return (
    <section
      className="py-12 relative bg-[var(--color-background)]"
      style={buildThemeStyle(theme)}
    >
      <Container className="relative max-w-[1540px] px-3 lg:px-4 xl:px-6">
        
        {/* TITLE */}
        <div className="mb-8">
          <SectionTitle title="Explore Menu" align="center" />
        </div>

        {/* SLIDER */}
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
                {/* IMAGE */}
                <div className="relative mx-auto h-36 w-36 md:h-40 md:w-40">
                  <Image
                    src={getSafeImage(item.imageUrl)}
                    alt={item.name}
                    fill
                    className="object-contain"
                  />
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