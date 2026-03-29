"use client";

import { X, Trash2, Minus, Plus, ShoppingCart } from "lucide-react";
import { CheckoutModal } from "@/components/cart/checkout-modal";
import { useCart } from "@/features/cart/cart-context";

type CartDrawerProps = {
    restaurantName: string;
    whatsappNumber: string;
};

export function CartDrawer({
                               restaurantName,
                               whatsappNumber,
                           }: CartDrawerProps) {
    const {
        items,
        isOpen,
        closeCart,
        increaseQty,
        decreaseQty,
        removeItem,
    } = useCart();

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

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
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-[var(--color-border)] bg-white shadow-2xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* HEADER */}
                <div className="border-b border-[var(--color-border)] px-5 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-[var(--color-primary)]" />
                            <h2 className="text-lg font-semibold">Your Order</h2>
                        </div>

                        <button
                            onClick={closeCart}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] hover:bg-slate-50"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Helper text */}
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
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                                NPR {item.price}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.menuItemId)}
                                            className="flex items-center gap-1 text-sm text-red-600 hover:underline"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Remove
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => decreaseQty(item.menuItemId)}
                                                className="h-8 w-8 rounded-lg border"
                                            >
                                                <Minus className="h-3 w-3 mx-auto" />
                                            </button>

                                            <span className="min-w-[28px] text-center font-semibold">
                        {item.quantity}
                      </span>

                                            <button
                                                onClick={() => increaseQty(item.menuItemId)}
                                                className="h-8 w-8 rounded-lg border"
                                            >
                                                <Plus className="h-3 w-3 mx-auto" />
                                            </button>
                                        </div>

                                        <p className="font-semibold text-[var(--color-primary)]">
                                            NPR {item.price * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* FOOTER */}
                {items.length > 0 && (
                    <div className="border-t border-[var(--color-border)] p-5">
                        <div className="mb-4 flex justify-between text-sm">
                            <span className="text-[var(--color-text-muted)]">Total</span>
                            <span className="text-lg font-bold text-[var(--color-primary)]">
                NPR {total}
              </span>
                        </div>

                        <CheckoutModal
                            restaurantName={restaurantName}
                            whatsappNumber={whatsappNumber}
                        />
                    </div>
                )}
            </aside>
        </>
    );
}