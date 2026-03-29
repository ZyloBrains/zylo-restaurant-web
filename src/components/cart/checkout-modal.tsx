"use client";

import { useMemo, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
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
    const { items, subtotal, closeCart } = useCart();

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
            {/* FOOTER BUTTON */}
            <div className="border-t border-[var(--color-border)] px-5 py-4">
                <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Subtotal</span>
                    <span className="text-lg font-bold text-[var(--color-primary)]">
            NPR {subtotal}
          </span>
                </div>

                <button
                    onClick={openCheckout}
                    className="btn-primary w-full"
                    disabled={items.length === 0}
                >
                    Proceed to Checkout
                </button>
            </div>

            {/* OVERLAY */}
            {isCheckoutOpen && (
                <button
                    aria-label="Close checkout overlay"
                    className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
                    onClick={closeCheckout}
                />
            )}

            {/* MODAL */}
            <div
                className={`fixed inset-x-0 bottom-0 z-[70] mx-auto max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 md:bottom-6 md:rounded-3xl ${
                    isCheckoutOpen ? "translate-y-0" : "translate-y-[110%]"
                }`}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-4">
                    <h2 className="text-lg font-semibold">Checkout</h2>

                    <button
                        onClick={closeCheckout}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)]"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* SUCCESS STATE */}
                {isSuccess ? (
                    <div className="grid gap-6 p-6 md:p-8">
                        <div className="flex items-start gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
                            <CheckCircle2 className="mt-1 h-6 w-6 text-emerald-600" />
                            <div>
                                <h3 className="text-xl font-bold text-emerald-700">
                                    Demo order placed successfully
                                </h3>
                                <p className="mt-2 text-sm text-emerald-800">
                                    In production, this will be saved to backend before redirecting
                                    to WhatsApp.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noreferrer"
                                className="btn-primary"
                            >
                                Send via WhatsApp
                            </a>

                            <button
                                onClick={() => {
                                    setIsSuccess(false);
                                    closeCheckout();
                                    closeCart();
                                }}
                                className="btn-secondary"
                            >
                                Finish Demo
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-[1fr_0.95fr]">

                        {/* LEFT FORM */}
                        <div className="border-b border-[var(--color-border)] p-5 md:border-b-0 md:border-r md:p-6">
                            <h3 className="text-lg font-semibold">Customer Details</h3>

                            <div className="mt-5 grid gap-4">
                                {[
                                    {
                                        label: "Name *",
                                        key: "customerName",
                                        placeholder: "Enter customer name",
                                    },
                                    {
                                        label: "Phone *",
                                        key: "customerPhone",
                                        placeholder: "98XXXXXXXX",
                                    },
                                ].map((field) => (
                                    <div key={field.key}>
                                        <label className="mb-2 block text-sm font-medium">
                                            {field.label}
                                        </label>
                                        <input
                                            value={form[field.key as keyof CheckoutFormData] as string}
                                            onChange={(e) =>
                                                updateField(field.key as any, e.target.value)
                                            }
                                            className="w-full rounded-xl border border-[var(--color-border)] px-4 py-3 focus:border-[var(--color-primary)] outline-none"
                                            placeholder={field.placeholder}
                                        />
                                    </div>
                                ))}

                                <textarea
                                    value={form.customerAddress}
                                    onChange={(e) =>
                                        updateField("customerAddress", e.target.value)
                                    }
                                    className="min-h-24 w-full rounded-xl border border-[var(--color-border)] px-4 py-3"
                                    placeholder="Address"
                                />

                                <textarea
                                    value={form.customerNotes}
                                    onChange={(e) =>
                                        updateField("customerNotes", e.target.value)
                                    }
                                    className="min-h-24 w-full rounded-xl border border-[var(--color-border)] px-4 py-3"
                                    placeholder="Notes"
                                />

                                <button onClick={handlePlaceDemoOrder} className="btn-primary">
                                    Place Demo Order
                                </button>
                            </div>
                        </div>

                        {/* RIGHT SUMMARY */}
                        <div className="p-5 md:p-6">
                            <h3 className="text-lg font-semibold">Order Summary</h3>

                            <div className="mt-5 space-y-3">
                                {items.map((item) => (
                                    <div key={item.menuItemId} className="card-base p-4">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-[var(--color-text-muted)]">
                                                    NPR {item.price} × {item.quantity}
                                                </p>
                                            </div>
                                            <p className="font-semibold text-[var(--color-primary)]">
                                                NPR {item.price * item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 rounded-2xl bg-[var(--color-surface)] p-4">
                                <div className="flex justify-between">
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Total
                  </span>
                                    <span className="text-lg font-bold text-[var(--color-primary)]">
                    NPR {subtotal}
                  </span>
                                </div>
                            </div>

                            <div className="mt-5">
                                <h4 className="text-sm font-semibold text-[var(--color-primary)]">
                                    WhatsApp Preview
                                </h4>
                                <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-[var(--color-border)] bg-slate-50 p-4 text-xs">
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