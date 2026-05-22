"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useMenuStore } from "@/app/store/menu-store";
import { useCart } from "@/features/cart/cart-context";

function getSafeImage(src?: string) {
  if (!src || src.trim() === "") return "/images/placeholder-food.jpg";
  if (src.startsWith("http")) return src;
  if (!src.startsWith("/")) return `/${src}`;
  return src;
}

export default function MenuItemPage() {
  const item = useMenuStore((s) => s.selectedItem);
  const { addItem, getItemQty } = useCart();

  if (!item) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading item...
      </div>
    );
  }

  const qty = getItemQty(item.id);

  const showToast = (qtyAfter: number) => {
    toast.custom(
      () => (
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
      ),
      { duration: 2200 }
    );
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

    showToast(qty + 1);
  };

  return (
    <div className="bg-[var(--color-background)] min-h-[calc(100vh-120px)] px-4 pt-10 pb-8">
      
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">

        {/* IMAGE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative h-[450px] rounded-3xl overflow-hidden shadow-lg"
        >
          <Image
            src={getSafeImage(item.imageUrl)}
            alt={item.name}
            fill
            className="object-cover"
          />

          {/* QTY BADGE */}
          {qty > 0 && (
            <div className="absolute right-4 top-4 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow-md">
              {qty} in cart
            </div>
          )}
        </motion.div>

        {/* DETAILS */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            {item.name}
          </h1>

          <p className="mt-3 text-[var(--color-text-muted)]">
            {item.shortDescription}
          </p>

          <p className="mt-5 text-3xl font-bold text-[var(--color-primary)]">
            NPR {item.price}
          </p>

          {/* BADGES */}
          <div className="mt-4 flex gap-2">
            {item.isSpicy && (
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs">
                🌶 Spicy
              </span>
            )}

            {item.isFeatured && (
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs">
                ⭐ Popular
              </span>
            )}
          </div>

          {/* BUTTON */}
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={handleAdd}
              className="btn-primary w-full md:w-auto"
            >
              {qty > 0 ? "Add One More" : "Add to Cart"}
            </button>

            {qty > 0 && (
              <span className="text-sm font-medium text-[var(--color-text-muted)]">
                Qty: {qty}
              </span>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}