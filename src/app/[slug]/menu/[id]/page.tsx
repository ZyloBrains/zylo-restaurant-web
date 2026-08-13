"use client";

import { toast } from "sonner";

import { useMenuItemStore } from "@/app/[slug]/store/menu-store";
import { useCart } from "@/features/cart/cart-context";
import { resolveImageUrl } from "@/lib/utils/image.utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { useQuickCheckoutStore } from "@/features/cart/quick-checkout-store";
import { OutOfStockBridge } from "@/components/menu/out-of-stock-bridge";

export default function MenuItemPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const id = params?.id as string;
  const router = useRouter();
  const fetchItemById = useMenuItemStore((s) => s.fetchItemById);
  const item = useMenuItemStore((s) => s.selectedItem);
  const { items, addItem, increaseQty, decreaseQty } = useCart();

  useEffect(() => {
    if (!slug || !id) return;
    fetchItemById(slug, id);
  }, [slug, id, fetchItemById]);

  if (!item) {
    return (
      <div className="p-10 text-center text-[var(--color-text-muted)]">
        Loading item...
      </div>
    );
  }

  const cartItem = items.find((i) => i.menuItemId === item.id.toString());
  const qty = cartItem?.quantity ?? 0;
  const isInactive = !item.active;

  const showToast = (qtyAfter: number) => {
    toast.custom(
      () => (
        <div className="flex w-[340px] items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-3 shadow-[var(--shadow-card)]">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)]">
            <img
              src={resolveImageUrl(item.imageUrl)}
              alt={item.name}
              className="absolute inset-0 h-full w-full object-cover"
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

  const handleIncrease = () => {
    increaseQty(item.id.toString());
  };

  const handleDecrease = () => {
    decreaseQty(item.id.toString());
  };

  const handleOrderNow = () => {
    addItem({
      menuItemId: item.id.toString(),
      itemId: item.id,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl || "",
      isSpicy: item.tags?.includes("spicy"),
      isFeatured: item.tags?.includes("featured"),
    });

    useQuickCheckoutStore.getState().openCheckout?.();
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/${slug}/menu`);
    }
  };

  return (
    <div className="bg-[var(--color-background)] min-h-[calc(100vh-120px)] px-4 pt-10 pb-8">

      <button
        onClick={handleBack}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition"
      >
        <ArrowLeft size={18} />
        Back to Menu
      </button>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">

        {/* IMAGE */}
        <div
          className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden shadow-lg border border-[var(--color-border)]/50 animate-fade-in"
          style={{ animationDuration: "0.4s" }}
        >
          <img
            src={resolveImageUrl(item.imageUrl)}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
          />

          {/* OUT OF STOCK BRIDGE */}
          {isInactive && <OutOfStockBridge />}

          {/* QTY BADGE */}
          {qty > 0 && (
            <div className="absolute right-4 top-4 rounded-full bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white shadow-md">
              {qty} in cart
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div
          className="animate-fade-up"
          style={{ animationDuration: "0.4s" }}
        >
          <h1 className="text-4xl font-bold text-[var(--color-text)]">
            {item.name}
          </h1>

          <p className="mt-3 text-[var(--color-text-muted)]">
            {item.description}
          </p>

          <p className="mt-5 text-3xl font-bold text-[var(--color-primary-text)]">
            NPR {item.price}
          </p>

          {/* BADGES */}
          <div className="mt-4 flex flex-wrap gap-2">
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

            {isInactive && (
              <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 text-xs">
                Out of Stock
              </span>
            )}
          </div>

          {/* QUANTITY + ORDER NOW */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {isInactive ? (
              <button
                disabled
                className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                Out of Stock
              </button>
            ) : qty === 0 ? (
              <>
                <button
                  onClick={handleOrderNow}
                  className="btn-primary w-full sm:flex-1"
                >
                  Order Now
                </button>

                <button
                  onClick={handleAdd}
                  className="btn-secondary w-full sm:flex-1"
                >
                  Add to Cart
                </button>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-4 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-card)] px-2 py-2">
                  <button
                    onClick={handleDecrease}
                    aria-label="Decrease quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] transition duration-200 hover:bg-[var(--color-primary)] hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="min-w-[32px] text-center text-xl font-bold text-[var(--color-text)]">
                    {qty}
                  </span>

                  <button
                    onClick={handleIncrease}
                    aria-label="Increase quantity"
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white transition duration-200 hover:bg-[var(--color-primary-hover)]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleOrderNow}
                  className="btn-primary w-full sm:flex-1"
                >
                  Order Now
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
