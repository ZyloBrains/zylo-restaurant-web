"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useCart } from "@/features/cart/cart-context";
import { getSafeImage } from "@/lib/utils/image.utils";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function MenuItemPage() {
  const params= useParams();
  const slug= params?.slug as string;
  const id= params?.id as string;
  const fetchItemById = useMenuItemStore((s) => s.fetchItemById);
  const item= useMenuItemStore((s)=>s.selectedItem);
  const { addItem, getItemQty } = useCart();

  
  useEffect(()=>{
    if(!slug || !id) return;
    fetchItemById(slug,id);
  },[slug,id]);

  if (!item) {
    return (
      <div className="p-10 text-center text-[var(--color-text-muted)]">
        Loading item...
      </div>
    );
  }

  const qty = getItemQty(item.id.toString());

  const showToast = (qtyAfter: number) => {
    toast.custom(
      () => (
        <div className="flex w-[340px] items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-[var(--shadow-card)]">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)]">
            <Image
              src={getSafeImage(item.imageUrl)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="56px"
              unoptimized
            />
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
      { duration: 2200 }
    );
  };

  const handleAdd = () => {
    addItem({
      menuItemId: item.id.toString(),
      itemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl || "",
      isSpicy: item.tags?.includes("spicy"),
      isFeatured: item.tags?.includes("featured"),
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
          className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-[var(--color-border)]/50"
        >
          <Image
            src={getSafeImage(item.imageUrl)}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 hover:scale-105"
            unoptimized
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
            {item.description}
          </p>

          <p className="mt-5 text-3xl font-bold text-[var(--color-primary)]">
            NPR {item.price}
          </p>

          {/* BADGES */}
          <div className="mt-4 flex gap-2">
            {item.tags?.includes("spicy") && (
              <span className="px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 text-xs">
                🌶 Spicy
              </span>
            )}

            {item.tags?.includes("featured") && (
              <span className="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-400 text-xs">
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