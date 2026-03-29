"use client";

import { ShoppingCart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCart } from "@/features/cart/cart-context";

type HeaderProps = {
    restaurantName: string;
};

export function Header({ restaurantName }: HeaderProps) {
    const { itemCount, openCart } = useCart();

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
            <Container className="flex h-16 items-center justify-between">

                {/* LOGO */}
                <a
                    href="#top"
                    className="text-lg font-bold tracking-tight text-[var(--color-primary)]"
                    style={{ fontFamily: "var(--font-heading, Poppins)" }}
                >
                    {restaurantName}
                </a>

                {/* NAV */}
                <nav className="hidden items-center gap-6 md:flex">
                    {[
                        { label: "About", href: "#about" },
                        { label: "Menu", href: "#menu" },
                        { label: "Services", href: "#services" },
                        { label: "Contact", href: "#contact" },
                    ].map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
                        >
                            {item.label}
                        </a>
                    ))}

                    {/* CART BUTTON */}
                    <button
                        onClick={openCart}
                        className="relative btn-primary flex items-center gap-2 px-4 py-2"
                    >
                        <ShoppingCart className="h-4 w-4" />

                        <span>Cart</span>

                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-white">
                {itemCount}
              </span>
                        )}
                    </button>
                </nav>
            </Container>
        </header>
    );
}