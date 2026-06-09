"use client";

import Image from "next/image";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import { CheckoutModal } from "@/components/cart/checkout-modal";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { getSafeImage } from "@/lib/utils/image.utils";


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
    <div className="bg-(--color-background) min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-(--color-text)">Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 bg-[var(--color-surface)] rounded-2xl p-6 shadow-[var(--shadow-card)]">

              <div className="flex justify-between mb-6">
              <h2 className="font-semibold text-[var(--color-text)]">Your Bucket</h2>
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
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] shadow-inner">
                      <Image
                        src={getSafeImage(item.imageUrl)}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                      <div>
                      <h3 className="font-semibold text-[var(--color-text)]">{item.name}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        NRS {item.price}
                      </p>
                    </div>
                  </div>

                  {/* QTY (UNCHANGED BUTTONS) */}
                  <div className="
                    flex items-center justify-between md:justify-center
                    gap-3 border border-[var(--color-border)] rounded-lg px-3 py-2 text-[var(--color-text)]
                  ">
                    <button onClick={() => decreaseQty(item.menuItemId)} className="text-[var(--color-text-muted)]">
                      <Minus size={14} />
                    </button>

                    <span className="min-w-[20px] text-center">
                      {item.quantity}
                    </span>

                    <button onClick={() => increaseQty(item.menuItemId)} className="text-[var(--color-text-muted)]">
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="text-left md:text-center">
                    {item.discountAmount ? (
                      <>
                        <p className="text-xs text-[var(--color-text-muted)] line-through">NRS {item.price * item.quantity}</p>
                        <p className="font-semibold text-emerald-600 dark:text-emerald-400">NRS {item.price * item.quantity - item.discountAmount}</p>
                        {item.discountPercent ? <p className="text-[10px] text-emerald-500">({item.discountPercent}% off)</p> : null}
                      </>
                    ) : (
                      <span className="font-semibold text-[var(--color-text)]">NRS {item.price * item.quantity}</span>
                    )}
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

            <h2 className="font-semibold mb-4 text-[var(--color-text)]">Order Summary</h2>

            <div className="space-y-2 text-sm text-[var(--color-text)]">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Item Total</span>
                <span>NRS {subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[var(--color-text-muted)]">Sub Total</span>
                <span>NRS {subtotal}</span>
              </div>

              <hr className="my-3 border-[var(--color-border)]" />

              <div className="flex justify-between font-bold text-lg text-[var(--color-text)]">
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
                tenantSlug={tenantInfo?.tenantSlug as string}
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}