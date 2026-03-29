"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingCart } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCart } from "@/features/cart/cart-context";

type HeaderProps = {
    restaurantName: string;
};

const navItems = [
    { label: "About", href: "#about" },
    { label: "Menu", href: "#menu" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
];

export function Header({ restaurantName }: HeaderProps) {
    const { itemCount, openCart } = useCart();
    const [animateCart, setAnimateCart] = useState(false);

    useEffect(() => {
        if (itemCount <= 0) return;

        setAnimateCart(true);

        const timer = window.setTimeout(() => {
            setAnimateCart(false);
        }, 450);

        return () => window.clearTimeout(timer);
    }, [itemCount]);

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
            <Container className="flex h-16 items-center justify-between gap-4">
                <a
                    href="#top"
                    className="shrink-0 text-lg font-bold tracking-tight text-[var(--color-primary)] sm:text-xl"
                    style={{ fontFamily: "var(--font-heading, Poppins)" }}
                    aria-label={`${restaurantName} home`}
                >
                    {restaurantName}
                </a>

                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-[var(--color-text-muted)] transition hover:text-[var(--color-primary)]"
                        >
                            {item.label}
                        </a>
                    ))}

                    <button
                        type="button"
                        onClick={openCart}
                        aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
                        className={`relative inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-95 ${
                            animateCart ? "scale-105" : "scale-100"
                        }`}
                    >
                        <ShoppingCart
                            className={`h-4 w-4 ${animateCart ? "animate-bounce" : ""}`}
                        />
                        <span>Cart</span>

                        {itemCount > 0 && (
                            <span className="absolute -right-2 -top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-white shadow">
                {itemCount}
              </span>
                        )}
                    </button>
                </nav>

                <div className="flex items-center gap-2 md:hidden">
                    <button
                        type="button"
                        aria-label="Open navigation"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] bg-white text-[var(--color-text)] shadow-sm"
                    >
                        <Menu className="h-5 w-5" />
                    </button>

                    <button
                        type="button"
                        onClick={openCart}
                        aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
                        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-sm"
                    >
                        <ShoppingCart
                            className={`h-5 w-5 ${animateCart ? "animate-bounce" : ""}`}
                        />

                        {itemCount > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-white shadow">
                {itemCount}
              </span>
                        )}
                    </button>
                </div>
            </Container>
        </header>
    );
}