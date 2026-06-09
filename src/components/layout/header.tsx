/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, ShoppingCart, X, Sun, Moon, UtensilsCrossed, User } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useCart } from "@/features/cart/cart-context";
import { AuthButton } from "../auth/auth-buttton";
import { UserDropdown } from "../auth/user-dropdown";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { useAuthStore } from "@/features/auth/auth.store";
import { LoginModal } from "@/components/auth/login-modal";
import Image from "next/image";
import { getSafeImage } from "@/lib/utils/image.utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Services", href: "/services" },
];

function SvgIcon({ path, size }: { path: string; size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size || 18} height={size || 18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: path }} />
  );
}

const navIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Home: (p) => <SvgIcon path='<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' {...p} />,
  Menu: UtensilsCrossed,
  Services: (p) => <SvgIcon path='<path d="M6 4H18M6 8H18M6 12H12M6 16H18M6 20H18"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="20" r="2"/>' {...p} />,
};

function AuthButtonCompact() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => { setHydrated(true); }, []);

  if (!hydrated) {
    return <div className="h-10 w-10 rounded-full border border-[var(--color-border)]" />;
  }

  if (user) {
    return <UserDropdown />;
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center h-10 w-10 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition"
        aria-label="Login / Register"
      >
        <User size={18} />
      </button>

      {open && (
        <LoginModal onClose={() => setOpen(false)} onSuccess={() => {}} />
      )}
    </>
  );
}

export function Header() {
  const slug = useTenantStore((s) => s.tenantSlug);
  const tenant = useTenantStore((s) => s.tenant);
  const darkModeBySlug = useTenantStore((s) => s.darkModeBySlug);
  const tenantTheme = useTenantStore((s) => s.tenantTheme);
  const toggleDarkMode = useTenantStore((s) => s.toggleDarkMode);

  const isDarkMode = slug ? (darkModeBySlug[slug] ?? (tenantTheme?.defaultDarkMode === "dark" || tenantTheme?.defaultDarkMode === "true")) : false;

  const { itemCount, openCart } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [animateCart, setAnimateCart] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHydrated(true); }, []);

  useEffect(() => {
    if (itemCount <= 0) return;
    setAnimateCart(true);
    const t = setTimeout(() => setAnimateCart(false), 400);
    return () => clearTimeout(t);
  }, [itemCount]);

  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileOpen]);

  if (!tenant || !hydrated) {
    return (
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md">
        <Container className="flex h-14 md:h-16 items-center">
          <div className="text-lg font-bold text-[var(--color-text)]">Loading...</div>
        </Container>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md">
      <Container className="relative flex h-14 md:h-16 items-center justify-between max-w-[1540px] px-3 lg:px-4 xl:px-6">
        {/* LOGO */}
        <a href="#top" className="flex items-center gap-2 min-w-0 flex-shrink">
          {tenant.faviconUrl && (
            <Image
              src={getSafeImage(tenant.faviconUrl)}
              alt={`${tenant.restaurantName || "Restaurant"} logo`}
              width={28}
              height={28}
              className="h-7 w-7 md:h-8 md:w-8 object-cover rounded-full flex-shrink-0"
              unoptimized
            />
          )}
          <span className="text-base md:text-xl font-bold text-[var(--color-primary)] truncate">
            {tenant.restaurantName || "Restaurant"}
          </span>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-10">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={`/${slug}${item.href}`}
              className="text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP RIGHT */}
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
            className="relative bg-[var(--color-primary)] text-white px-4 py-2 rounded-full flex items-center gap-2 hover:opacity-90 transition"
          >
            <ShoppingCart className={animateCart ? "animate-bounce" : ""} size={18} />
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[var(--color-accent)] text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* MOBILE TOOLBAR */}
        <div className="flex md:hidden items-center gap-1">
          <AuthButtonCompact />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-full border border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-border)]/20 transition"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </Container>

      {/* MOBILE SLIDE-DOWN MENU */}
      <div
        ref={menuRef}
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 pb-4 gap-1 bg-[var(--color-card)] border-t border-[var(--color-border)]">
          {navItems.map((item) => {
            const Icon = navIconMap[item.label];
            return (
              <Link
                key={item.label}
                href={`/${slug}${item.href}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--color-text)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition active:scale-[0.98]"
              >
                {Icon && <Icon size={18} />}
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}

          <hr className="my-2 border-[var(--color-border)]" />

          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-[var(--color-text-muted)]">Dark mode</span>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition"
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>


        </nav>
      </div>
    </header>
  );
}
