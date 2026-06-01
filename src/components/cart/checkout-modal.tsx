"use client";

import { useMemo, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";
import type { CheckoutFormData } from "@/features/checkout/checkout.types";
import {
    buildWhatsAppLink,
    buildWhatsAppOrderMessage,
} from "@/features/checkout/whatsapp-preview";

type Props = {
    restaurantName: string;
    whatsappNumber: string;
};

const initialForm: CheckoutFormData = {
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    customerNotes: "",
};

export function CheckoutModal({ restaurantName, whatsappNumber }: Props) {
    const { items, subtotal, clearCart, closeCart } = useCart();

    const [open, setOpen] = useState(false);
    const [success, setSuccess] = useState(false);
    const [form, setForm] = useState(initialForm);

    const message = useMemo(
        () =>
            buildWhatsAppOrderMessage({
                ...form,
                items,
                subtotal,
                restaurantName,
            }),
        [form, items, subtotal, restaurantName]
    );

    const link = useMemo(
        () => buildWhatsAppLink(whatsappNumber, message),
        [whatsappNumber, message]
    );

    return (
        <>
            {/* BUTTON */}
            <button onClick={() => setOpen(true)} className="btn-primary w-full">
                Place Order
            </button>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur md:items-center">
                    <div className="w-full max-w-3xl rounded-3xl bg-[var(--color-card)] shadow-2xl">
                        {/* HEADER */}
                        <div className="flex justify-between border-b p-4">
                            <h2 className="font-semibold">Checkout</h2>
                            <button onClick={() => setOpen(false)}>
                                <X />
                            </button>
                        </div>

                        {success ? (
                            <div className="p-6 text-center">
                                <CheckCircle2 className="mx-auto text-[var(--color-accent)]" size={32} />
                                <p className="mt-3 font-semibold">
                                    Demo order placed successfully
                                </p>

                                <a href={link} target="_blank" className="btn-primary mt-4">
                                    Send via WhatsApp
                                </a>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2">
                                {/* FORM */}
                                <div className="p-5 space-y-4">
                                    <h3 className="font-semibold">Customer Details</h3>

                                    <input
                                        className="input-base"
                                        placeholder="Name"
                                        value={form.customerName}
                                        onChange={(e) =>
                                            setForm({ ...form, customerName: e.target.value })
                                        }
                                    />

                                    <input
                                        className="input-base"
                                        placeholder="Phone"
                                        value={form.customerPhone}
                                        onChange={(e) =>
                                            setForm({ ...form, customerPhone: e.target.value })
                                        }
                                    />

                                    <textarea
                                        className="input-base"
                                        placeholder="Address"
                                        value={form.customerAddress}
                                        onChange={(e) =>
                                            setForm({ ...form, customerAddress: e.target.value })
                                        }
                                    />

                                    <textarea
                                        className="input-base"
                                        placeholder="Notes"
                                        value={form.customerNotes}
                                        onChange={(e) =>
                                            setForm({ ...form, customerNotes: e.target.value })
                                        }
                                    />

                                    <button
                                        onClick={() => setSuccess(true)}
                                        className="btn-primary w-full"
                                    >
                                        Place Demo Order
                                    </button>
                                </div>

                                {/* SUMMARY */}
                                <div className="p-5 space-y-4">
                                    <h3 className="font-semibold">Order Summary</h3>

                                    {items.map((item) => (
                                        <div key={item.menuItemId} className="card-base p-3">
                                            {item.name} × {item.quantity}
                                        </div>
                                    ))}

                                    <div className="font-bold text-[var(--color-primary)]">
                                        Total: NPR {subtotal}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}