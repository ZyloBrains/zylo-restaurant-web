"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { MenuItem } from "../../features/menu/menu.types";
import { useCart } from "@/features/cart/cart-context";
import { useMenuStore } from "@/app/store/menu-store";

function getSafeImage(src?: string): string {
  if (!src || src.trim() === "") return "/images/placeholder-food.jpg";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (!src.startsWith("/")) return `/${src}`;
  return src;
}

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { addItem, getItemQty } = useCart();
  const setSelectedItem = useMenuStore((s) => s.setSelectedItem);
  const router = useRouter();

  const qty = getItemQty(item.id);

  const showAddToCartToast = (qtyAfter: number) => {
    toast.custom(() => (
      <div className="flex w-[340px] items-center gap-3 rounded-2xl border border-white/10 bg-white p-3 shadow-xl">
        <div className="relative h-14 w-14 overflow-hidden rounded-xl bg-gray-100">
          <Image
            src={getSafeImage(item.imageUrl)}
            alt={item.name}
            fill
            className="object-cover"
            sizes="56px"
          />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">
            {item.name} added to cart
          </p>
          <p className="mt-0.5 text-xs text-slate-500">
            Qty in cart: {qtyAfter}
          </p>
        </div>

        <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          NPR {item.price}
        </div>
      </div>
    ), { duration: 2200 });
  };

  const handleAdd = () => {
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      isSpicy: item.isSpicy,
      isFeatured: item.isFeatured,
    });

    showAddToCartToast(qty + 1);
  };

  return (
    <motion.div
      onClick={() => {
        setSelectedItem(item);
        router.push(`/menu/${item.id}`);
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="card-base card-hover group p-5 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
        <Image
          src={getSafeImage(item.imageUrl)}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-300 group-hover:scale-[1.03]"
        />

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
          {item.shortDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {item.isSpicy && (
            <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
              🌶 Spicy
            </span>
          )}

          {item.isFeatured && (
            <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
              ⭐ Popular
            </span>
          )}

          {item.isAvailable ? (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              ✔ Available
            </span>
          ) : (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
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
            disabled={!item.isAvailable}
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
    </motion.div>
  );
}