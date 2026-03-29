"use client";

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

    return (
        <>
            {isOpen ? (
                <button
                    aria-label="Close cart overlay"
                    className="fixed inset-0 z-40 bg-black/30"
                    onClick={closeCart}
                />
            ) : null}

            <aside
                className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h2
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading, Poppins)" }}
                    >
                        Your Cart
                    </h2>
                    <button
                        onClick={closeCart}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">
                    {items.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-[var(--color-text-muted)]">
                            Your cart is empty.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.menuItemId}
                                    className="rounded-2xl border border-slate-200 p-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="font-semibold">{item.name}</h3>
                                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                                NPR {item.price}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => removeItem(item.menuItemId)}
                                            className="text-sm font-medium text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => decreaseQty(item.menuItemId)}
                                                className="rounded-lg border border-slate-300 px-3 py-1"
                                            >
                                                -
                                            </button>
                                            <span className="min-w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                                            <button
                                                onClick={() => increaseQty(item.menuItemId)}
                                                className="rounded-lg border border-slate-300 px-3 py-1"
                                            >
                                                +
                                            </button>
                                        </div>

                                        <p className="text-sm font-semibold text-[var(--color-primary)]">
                                            NPR {item.price * item.quantity}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <CheckoutModal
                    restaurantName={restaurantName}
                    whatsappNumber={whatsappNumber}
                />
            </aside>
        </>
    );
}