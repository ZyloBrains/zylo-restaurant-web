"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/features/cart/cart-context";
import type { CheckoutFormData } from "@/features/checkout/checkout.types";
import {
    buildWhatsAppLink,
    buildWhatsAppOrderMessage,
} from "@/features/checkout/whatsapp-preview";

type CheckoutModalProps = {
    restaurantName: string;
    whatsappNumber: string;
};

const initialForm: CheckoutFormData = {
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerNotes: "",
};

export function CheckoutModal({
                                  restaurantName,
                                  whatsappNumber,
                              }: CheckoutModalProps) {
    const { items, subtotal, isOpen, closeCart } = useCart();

    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [form, setForm] = useState<CheckoutFormData>(initialForm);

    function openCheckout() {
        if (items.length === 0) return;
        setIsCheckoutOpen(true);
    }

    function closeCheckout() {
        setIsCheckoutOpen(false);
        setIsSuccess(false);
    }

    function updateField<K extends keyof CheckoutFormData>(
        key: K,
        value: CheckoutFormData[K]
    ) {
        setForm((prev) => ({ ...prev, [key]: value }));
    }

    const whatsappMessage = useMemo(() => {
        return buildWhatsAppOrderMessage({
            ...form,
            items,
            subtotal,
            restaurantName,
        });
    }, [form, items, subtotal, restaurantName]);

    const whatsappLink = useMemo(() => {
        return buildWhatsAppLink(whatsappNumber, whatsappMessage);
    }, [whatsappNumber, whatsappMessage]);

    function handlePlaceDemoOrder() {
        if (!form.customerName.trim() || !form.customerPhone.trim()) {
            alert("Please enter customer name and phone.");
            return;
        }

        setIsSuccess(true);
    }

    return (
        <>
            <div className="border-t border-slate-200 px-5 py-4">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-[var(--color-text-muted)]">Subtotal</span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
            NPR {subtotal}
          </span>
                </div>

                <button
                    onClick={openCheckout}
                    className="w-full rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={items.length === 0}
                >
                    Proceed to Checkout
                </button>
            </div>

            {isCheckoutOpen ? (
                <button
                    aria-label="Close checkout overlay"
                    className="fixed inset-0 z-[60] bg-black/40"
                    onClick={closeCheckout}
                />
            ) : null}

            <div
                className={`fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 md:bottom-6 md:rounded-3xl ${
                    isCheckoutOpen ? "translate-y-0" : "translate-y-[110%]"
                }`}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h2
                        className="text-lg font-semibold"
                        style={{ fontFamily: "var(--font-heading, Poppins)" }}
                    >
                        Checkout
                    </h2>
                    <button
                        onClick={closeCheckout}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                    >
                        Close
                    </button>
                </div>

                {isSuccess ? (
                    <div className="grid gap-6 p-6 md:p-8">
                        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                            <h3
                                className="text-2xl font-bold text-emerald-700"
                                style={{ fontFamily: "var(--font-heading, Poppins)" }}
                            >
                                Demo order placed successfully
                            </h3>
                            <p className="mt-3 text-sm text-emerald-800">
                                This is still static demo mode. In the real version, this will save
                                the order in the backend and then redirect to WhatsApp.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                            >
                                Send via WhatsApp
                            </a>

                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    closeCheckout();
                                    closeCart();
                                }}
                                className="rounded-[var(--radius-button)] border border-slate-300 px-5 py-3 text-sm font-semibold"
                            >
                                Finish Demo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-0 md:grid-cols-[1fr_0.95fr]">
                        <div className="border-b border-slate-200 p-5 md:border-b-0 md:border-r md:p-6">
                            <h3
                                className="text-lg font-semibold"
                                style={{ fontFamily: "var(--font-heading, Poppins)" }}
                            >
                                Customer Details
                            </h3>

                            <div className="mt-5 grid gap-4">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={form.customerName}
                                        onChange={(e) => updateField("customerName", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Enter customer name"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">
                                        Phone <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        value={form.customerPhone}
                                        onChange={(e) => updateField("customerPhone", e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[var(--color-primary)]"
                                        placeholder="98XXXXXXXX"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Address</label>
                                    <textarea
                                        value={form.customerAddress}
                                        onChange={(e) => updateField("customerAddress", e.target.value)}
                                        className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Enter delivery address"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Notes</label>
                                    <textarea
                                        value={form.customerNotes}
                                        onChange={(e) => updateField("customerNotes", e.target.value)}
                                        className="min-h-24 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[var(--color-primary)]"
                                        placeholder="Less spicy, call before delivery, etc."
                                    />
                                </div>

                                <button
                                    onClick={handlePlaceDemoOrder}
                                    className="rounded-[var(--radius-button)] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white"
                                >
                                    Place Demo Order
                                </button>
                            </div>
                        </div>

                        <div className="p-5 md:p-6">
                            <h3
                                className="text-lg font-semibold"
                                style={{ fontFamily: "var(--font-heading, Poppins)" }}
                            >
                                Order Summary
                            </h3>

                            <div className="mt-5 space-y-3">
                                {items.map((item) => (
                                    <div
                                        key={item.menuItemId}
                                        className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 p-4"
                                    >
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                                                NPR {item.price} × {item.quantity}
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-[var(--color-primary)]">
                                            NPR {item.price * item.quantity}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-2xl bg-[var(--color-surface)] p-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--color-text-muted)]">Total</span>
                                    <span className="text-lg font-bold text-[var(--color-primary)]">
                    NPR {subtotal}
                  </span>
                                </div>
                            </div>

                            <div className="mt-5">
                                <h4 className="text-sm font-semibold text-[var(--color-primary)]">
                                    WhatsApp Preview
                                </h4>
                                <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-700">
                  {whatsappMessage}
                </pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}