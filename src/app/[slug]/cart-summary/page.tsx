"use client";

import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { CheckoutModal } from "@/components/cart/checkout-modal";
import { useTenantStore } from "@/features/tenant/tenant.store";

function getSafeImage(src?: string) {
  if (!src || src.trim() === "") return "/images/placeholder-food.jpg";
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (!src.startsWith("/")) return `/${src}`;
  return src;
}

export default function CartSummary() {
  const {
    items,
    increaseQty,
    decreaseQty,
    removeItem,
    subtotal,
  } = useCart();

  const tenantInfo= useTenantStore((s)=>s.tenant);

 

  return (
    <div className="bg-[var(--color-background)] min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)]">

            <div className="flex justify-between mb-6">
              <h2 className="font-semibold">Your Bucket</h2>
              <span className="text-sm text-[var(--color-text-muted)]">
                {items.length} items
              </span>
            </div>

            {/* ITEMS LIST */}
            <div className="space-y-4">

              {items.map((item) => (
                <div
                  key={item.menuItemId}
                  className="
                    flex flex-col md:grid 
                    md:grid-cols-[1fr_120px_120px_40px]
                    gap-4
                    border border-[var(--color-border)] rounded-xl
                    p-4
                    bg-[var(--color-card)]
                  "
                >

                  {/* PRODUCT */}
                  <div className="flex items-center gap-4">
                    <Image
                      src={getSafeImage(item.imageUrl)}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-xl object-cover"
                    />

                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        NRS {item.price}
                      </p>
                    </div>
                  </div>

                  {/* QTY (UNCHANGED BUTTONS) */}
                  <div className="
                    flex items-center justify-between md:justify-center
                    gap-3 border rounded-lg px-3 py-2
                  ">
                    <button onClick={() => decreaseQty(item.menuItemId)}>
                      <Minus size={14} />
                    </button>

                    <span className="min-w-[20px] text-center">
                      {item.quantity}
                    </span>

                    <button onClick={() => increaseQty(item.menuItemId)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="font-semibold text-left md:text-center">
                    NRS {item.price * item.quantity}
                  </div>

                  {/* REMOVE */}
                  <div className="flex justify-start md:justify-end">
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                </div>
              ))}

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)] h-fit">

            <h2 className="font-semibold mb-4">Order Summary</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Item Total</span>
                <span>NRS {subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Sub Total</span>
                <span>NRS {subtotal}</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[var(--color-primary)]">
                  NPR {subtotal}
                </span>
              </div>
            </div>

            {/* CHECKOUT */}
            <div className="mt-6">
              <CheckoutModal
                restaurantName={tenantInfo?.restaurantName as string}
                whatsappNumber={tenantInfo?.whatsappNumber as string}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}