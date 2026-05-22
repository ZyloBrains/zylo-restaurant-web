"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingCart, X, User } from "lucide-react";
import { Container } from "@/components/ui/container";
import { useCart } from "@/features/cart/cart-context";
import { AuthButton } from "@/components/auth/auth-buttton";

type HeaderProps = {
    restaurantName: string;
};

const navItems = [
    { label: "Home", href: "/" },
    { label: "Menu", href: "/menu" },
    { label: "Services", href: "#services" },
];

export function Header({ restaurantName }: HeaderProps) {
    const { itemCount, openCart } = useCart();

    const [mobileOpen, setMobileOpen] = useState(false);
    const [animateCart, setAnimateCart] = useState(false);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        if (itemCount <= 0) return;

        setAnimateCart(true);
        const t = setTimeout(() => setAnimateCart(false), 400);
        return () => clearTimeout(t);
    }, [itemCount]);

    return (
        <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">

            <Container className="relative flex h-16 items-center justify-between max-w-[1540px] px-3 lg:px-4 xl:px-6">

                {/* LOGO */}
                <a href="#top" className="flex items-center gap-2">
                    <img
                        src="/images/logo.png"
                        alt="logo"
                        className="h-8 w-8 object-contain"
                    />

                    <span className="text-xl font-bold text-[var(--color-primary)]">
                        {restaurantName}
                    </span>
                </a>

                {/* NAV */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                        >
                            {item.label}
                        </a>
                    ))}
                </nav>

                {/* RIGHT SIDE (DESKTOP) */}
                <div className="hidden md:flex items-center gap-3">

                    {/* AUTH */}
                    {isLoggedIn ? (
                        <button
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-primary)] text-white"
                        >
                            <User size={18} />
                        </button>
                    ) : (
                        <AuthButton onLoginSuccess={() => setIsLoggedIn(true)} />
                    )}

                    {/* CART */}
                    <button
                        onClick={openCart}
                        className="relative bg-[var(--color-primary)] text-white px-4 py-2 rounded-full flex items-center gap-2"
                    >
                        <ShoppingCart className={animateCart ? "animate-bounce" : ""} />
                        Cart

                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[10px] px-1 rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </button>

                </div>

                {/* MOBILE */}
                <div className="flex md:hidden items-center gap-2">

                    {/* AUTH (ICON ONLY WHEN LOGGED IN) */}
                    {isLoggedIn ? (
                        <button className="p-2 rounded-full bg-[var(--color-primary)] text-white">
                            <User size={18} />
                        </button>
                    ) : (
                        <AuthButton onLoginSuccess={() => setIsLoggedIn(true)} />
                    )}

                    {/* CART */}
                    <button
                        onClick={openCart}
                        className="relative p-2 bg-[var(--color-primary)] text-white rounded-full"
                    >
                        <ShoppingCart />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-cyan-500 text-[10px] px-1 rounded-full">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    {/* MENU */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="p-2 border rounded-full"
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </button>

                </div>
            </Container>

            {/* MOBILE MENU */}
            {mobileOpen && (
                <div
                    className="md:hidden"
                    style={{ backgroundColor: "var(--color-primary)" }}
                >
                    <nav className="flex flex-col p-4 gap-4 text-white">

                        {navItems.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                            >
                                {item.label}
                            </a>
                        ))}

                        <div className="border-t border-white/20 pt-3">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-2 text-white">
                                    <User size={18} />
                                </div>
                            ) : (
                                <AuthButton onLoginSuccess={() => setIsLoggedIn(true)} />
                            )}
                        </div>

                    </nav>
                </div>
            )}
        </header>
    );
}