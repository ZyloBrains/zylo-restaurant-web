"use client";

import { PhoneCall, MessageCircle, ShoppingCart } from "lucide-react";
import { useCart } from "@/features/cart/cart-context";

type MobileBottomBarProps = {
    phone: string;
    whatsappNumber: string;
};

export function MobileBottomBar({
                                    phone,
                                    whatsappNumber,
                                }: MobileBottomBarProps) {
    const { itemCount, openCart } = useCart();

    return (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-border)] bg-[var(--color-card)]/90 backdrop-blur-xl p-3 md:hidden">
            <div className="grid grid-cols-3 gap-2">
                <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-3 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                    <PhoneCall className="h-4 w-4" />
                    <span>Call</span>
                </a>

                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[var(--color-primary)] bg-[var(--color-card)] px-3 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[var(--color-surface)]"
                >
                    <MessageCircle className="h-4 w-4" />
                    <span>WhatsApp</span>
                </a>

                <button
                    onClick={openCart}
                    className="relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-[var(--color-primary)] px-3 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-primary-hover)]"
                >
                    <ShoppingCart className="h-4 w-4" />
                    <span>Cart</span>

                    {itemCount > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[10px] font-bold text-white shadow-sm">
              {itemCount}
            </span>
                    )}
                </button>
            </div>
        </div>
    );
}