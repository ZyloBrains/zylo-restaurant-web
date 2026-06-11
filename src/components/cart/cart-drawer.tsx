"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Trash2, Minus, Plus, ShoppingCart, ArrowLeft } from "lucide-react";
import { CheckoutModal } from "@/components/cart/checkout-modal";
import { useCart } from "@/features/cart/cart-context";
import { getSafeImage } from "@/lib/utils/image.utils";
import { useTenantStore } from "@/features/tenant/tenant.store";

type CartDrawerProps = {
  restaurantName: string;
  whatsappNumber: string;
  tenantSlug: string;
};

export function CartDrawer({
  restaurantName,
  whatsappNumber,
  tenantSlug,
}: CartDrawerProps) {
  const [showSummary, setShowSummary] = useState(false);
  const slug= useTenantStore((s)=>s.tenantSlug) as string;

  const {
    items,
    increaseQty,
    decreaseQty,
    removeItem,
    subtotal,
    total,
    isOpen,
    closeCart,
  } = useCart();

  return (
    <>
      {/* OVERLAY */}
      {isOpen && (
        <button
          aria-label="Close cart overlay"
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* DRAWER */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="border-b border-[var(--color-border)] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-[var(--color-primary)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Your Order</h2>
            </div>

            <button
              onClick={closeCart}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Review your items before checkout
          </p>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] p-8 text-center">
              <ShoppingCart className="mb-3 h-8 w-8 text-[var(--color-text-muted)]" />
              <p className="text-sm text-[var(--color-text-muted)]">
                Your order is empty.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
                Order Summary
              </p>

              {items.map((item) => (
                <div key={item.menuItemId} className="card-base p-4">
                  <div className="flex gap-4">
                    {/* IMAGE */}
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)]">
                      {item.imageUrl ? (
                        <Image
                          src={getSafeImage(item.imageUrl)}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-text-muted)]">
                          No Image
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                          <div>
                          <h3 className="font-semibold text-[var(--color-text)]">{item.name}</h3>
                          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                            NPR {item.price}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.menuItemId)}
                          className="text-red-600 text-sm hover:underline"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {item.discountPercent ? (
                        <div className="mt-1">
                          <span className="inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                            {item.discountPercent}% off
                          </span>
                        </div>
                      ) : null}

                      {/* QTY */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decreaseQty(item.menuItemId)}
                            className="h-8 w-8 rounded-lg border border-[var(--color-border)]"
                          >
                            <Minus className="h-3 w-3 mx-auto text-[var(--color-text)]" />
                          </button>

                          <span className="min-w-[28px] text-center font-semibold text-[var(--color-text)]">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQty(item.menuItemId)}
                            className="h-8 w-8 rounded-lg border border-[var(--color-border)]"
                          >
                            <Plus className="h-3 w-3 mx-auto text-[var(--color-text)]" />
                          </button>
                        </div>

                        <div className="text-right">
                          {item.discountAmount ? (
                            <>
                              <p className="text-xs text-[var(--color-text-muted)] line-through">
                                NPR {item.price * item.quantity}
                              </p>
                              <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                                NPR {item.price * item.quantity - item.discountAmount}
                              </p>
                            </>
                          ) : (
                            <p className="font-semibold text-[var(--color-primary)]">
                              NPR {item.price * item.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-muted)]">Total</span>
              <span className="text-lg font-bold text-[var(--color-primary)]">
                NPR {total}
              </span>
            </div>

            {/* VIEW CART SUMMARY BUTTON */}
            <button
              onClick={() => setShowSummary(true)}
              className="btn-secondary w-full text-center block"
            >
              View Cart Summary
            </button>

            {/* CHECKOUT */}
            <CheckoutModal
              restaurantName={restaurantName}
              whatsappNumber={whatsappNumber}
              tenantSlug={tenantSlug}
            />
          </div>
        )}

        {/* CART SUMMARY MODAL */}
        {showSummary && (
          <div className="absolute inset-0 z-30 flex flex-col bg-[var(--color-card)]">
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-5 py-4">
              <button onClick={() => setShowSummary(false)} className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface)]">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Cart Summary</h2>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.menuItemId} className="card-base p-4">
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)]">
                      {item.imageUrl ? (
                        <Image src={getSafeImage(item.imageUrl)} alt={item.name} fill sizes="64px" className="object-cover" unoptimized />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs text-[var(--color-text-muted)]">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-semibold text-[var(--color-text)]">{item.name}</h3>
                          <p className="mt-1 text-sm text-[var(--color-text-muted)]">NPR {item.price}</p>
                        </div>
                        <button onClick={() => removeItem(item.menuItemId)} className="text-red-600 text-sm hover:underline">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {item.discountPercent ? (
                        <span className="mt-1 inline-block rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">{item.discountPercent}% off</span>
                      ) : null}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => decreaseQty(item.menuItemId)} className="h-8 w-8 rounded-lg border border-[var(--color-border)]">
                            <Minus className="h-3 w-3 mx-auto text-[var(--color-text)]" />
                          </button>
                          <span className="min-w-[28px] text-center font-semibold text-[var(--color-text)]">{item.quantity}</span>
                          <button onClick={() => increaseQty(item.menuItemId)} className="h-8 w-8 rounded-lg border border-[var(--color-border)]">
                            <Plus className="h-3 w-3 mx-auto text-[var(--color-text)]" />
                          </button>
                        </div>
                        <div className="text-right">
                          {item.discountAmount ? (
                            <>
                              <p className="text-xs text-[var(--color-text-muted)] line-through">NPR {item.price * item.quantity}</p>
                              <p className="font-semibold text-emerald-600 dark:text-emerald-400">NPR {item.price * item.quantity - item.discountAmount}</p>
                            </>
                          ) : (
                            <p className="font-semibold text-[var(--color-primary)]">NPR {item.price * item.quantity}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[var(--color-border)] p-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[var(--color-text-muted)]">Total</span>
                <span className="text-lg font-bold text-[var(--color-primary)]">NPR {total}</span>
              </div>
              <CheckoutModal
                restaurantName={restaurantName}
                whatsappNumber={whatsappNumber}
                tenantSlug={tenantSlug}
              />
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
