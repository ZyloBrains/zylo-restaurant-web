/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { Menu, ShoppingCart, X, User, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useCart } from "@/features/cart/cart-context";
import { TenantResponse } from "@/types/tenant.types";
import { AuthButton } from "../auth/auth-buttton";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useAuthStore } from "@/features/auth/auth.store";
import Image from "next/image";
import { getSafeImage } from "@/lib/utils/image.utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Services", href: "/services" },
];

export function Header() {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const slug = useTenantStore((s) => s.tenantSlug);
  const tenant = useTenantStore((s) => s.tenant);
  const darkModeBySlug = useTenantStore((s) => s.darkModeBySlug);
  const tenantTheme = useTenantStore((s) => s.tenantTheme);
  const toggleDarkMode = useTenantStore((s) => s.toggleDarkMode);

  const isDarkMode = slug ? (darkModeBySlug[slug] ?? (tenantTheme?.defaultDarkMode === "dark" || tenantTheme?.defaultDarkMode === "true")) : false;
  const user = useAuthStore((s) => s.user);

  const { itemCount, openCart } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  // Cart animation
  useEffect(() => {
    if (itemCount <= 0) return;

    setAnimateCart(true);
    const t = setTimeout(() => setAnimateCart(false), 400);
    return () => clearTimeout(t);
  }, [itemCount]);

  // Fallback if tenant is null (before hydration, server and client render identically)
  if (!tenant || !hydrated) {
    return (
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md">
        <Container className="h-16 flex items-center">
          <div className="text-lg font-bold text-[var(--color-text)]">Loading...</div>
        </Container>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md">
      <Container className="relative flex h-16 items-center justify-between max-w-[1540px] px-3 lg:px-4 xl:px-6">
        {/* LOGO */}
        <a href="#top" className="flex items-center gap-2">
          {tenant.faviconUrl && (
            <Image
              src={getSafeImage(tenant.faviconUrl)}
              alt={`${tenant.restaurantName || "Restaurant"} logo`}
              width={32}
              height={32}
              className="h-8 w-8 object-cover rounded-full"
              unoptimized
            />
          )}

          <span className="text-xl font-bold text-[var(--color-primary)]">
            {tenant.restaurantName || "Restaurant"}
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`/${slug}/${item.href}`}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE (DESKTOP) */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <AuthButton />

          <button
            onClick={openCart}
            className="relative bg-[var(--color-primary)] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:bg-opacity-90 transition"
          >
            <ShoppingCart className={animateCart ? "animate-bounce" : ""} />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-white text-[10px] px-1.5 rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* MOBILE */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)]"
            title="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <AuthButton />

          <button
            onClick={openCart}
            className="relative p-2 bg-[var(--color-primary)] text-white rounded-full"
          >
            <ShoppingCart className={animateCart ? "animate-bounce" : ""} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--color-accent)] text-[10px] px-1 rounded-full">
                {itemCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 border border-[var(--color-border)] rounded-full text-[var(--color-text)]"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-primary)] text-white">
          <nav className="flex flex-col p-4 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={`/${slug}/${item.href}`}
                onClick={() => setMobileOpen(false)}
                className="py-2"
              >
                {item.label}
              </Link>
            ))}

            <div className="border-t border-white/20 pt-4">
              <AuthButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
