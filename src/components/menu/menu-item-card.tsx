"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { ItemResponse } from "../../features/menu/menu.types";
import { useCart } from "@/features/cart/cart-context";
import { getSafeImage } from "@/lib/utils/image.utils";
import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useTenantStore } from "@/features/tenant/tenant.store";

export function MenuItemCard({ item }: { item: ItemResponse }) {
  const { addItem, getItemQty } = useCart();
  const slug=useTenantStore((s)=>s.tenantSlug);
  const setSelectedItem = useMenuItemStore((s) => s.setSelectedItem);
  const router = useRouter();

  const qty = getItemQty(item?.id.toString());

  const showAddToCartToast = (qtyAfter: number) => {
    toast.custom(
      () => (
        <div className="flex w-[340px] items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-[var(--shadow-card)]">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)]">
            {item.imageUrl ? (
              <Image
                src={getSafeImage(item.imageUrl)}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                No Image
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">
              {item.name} added to cart
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">
              Qty in cart: {qtyAfter}
            </p>
          </div>

          <div className="rounded-full bg-[var(--color-accent)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)]">
            NPR {item.price}
          </div>
        </div>
      ),
      { duration: 2200 },
    );
  };

  const handleAdd = () => {
    addItem({
      menuItemId: item.id.toString(),
      itemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl as string,
      isSpicy: item.tags?.includes("spicy"),
      isFeatured: item.active,
    });

    showAddToCartToast(qty + 1);
  };

  return (
    <div
      onClick={() => {
        setSelectedItem(item);
        router.push(`/${slug}/menu/${item.id}`);
      }}
      className="card-base card-hover group p-5 cursor-pointer animate-fade-up"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] shadow-inner">
       {item.imageUrl ? (
              <Image
                src={getSafeImage(item.imageUrl)}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
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
                          text-[var(--color-text-muted)]
                        "
              >
                No Image
              </div>
            )}

        {qty > 0 && (
          <div className="absolute right-3 top-3 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow-md">
            {qty} in cart
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            {item.name}
          </h3>

          <span className="text-sm font-bold text-[var(--color-primary)]">
            NPR {item.price}
          </span>
        </div>

        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          {item.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.tags?.includes("spicy") && (
            <span className="rounded-full bg-orange-50 dark:bg-orange-950 px-3 py-1 text-xs font-semibold text-orange-600 dark:text-orange-400">
              🌶 Spicy
            </span>
          )}

          {item.active && (
            <span className="rounded-full bg-sky-50 dark:bg-sky-950 px-3 py-1 text-xs font-semibold text-sky-700 dark:text-sky-400">
              ⭐ Popular
            </span>
          )}

          {item.active ? (
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              ✔ Available
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-3 py-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
              Unavailable
            </span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdd();
            }}
            disabled={!item.active}
            className="btn-primary w-full sm:w-auto"
          >
            {qty > 0 ? "Add One More" : "Add to Cart"}
          </button>

          {qty > 0 && (
            <span className="text-sm font-medium text-[var(--color-text-muted)]">
              Qty: {qty}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
