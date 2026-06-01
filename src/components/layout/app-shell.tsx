"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { CartDrawer } from "@/components/cart/cart-drawer";
import React from "react";
import { useTenantStore } from "@/features/tenant/tenant.store";

export function Skeleton() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] animate-pulse">
      
      {/* HEADER */}
      <div className="h-16 border-b bg-[var(--color-surface)] flex items-center px-6">
        <div className="h-6 w-40 bg-gray-300/60 rounded-full" />
      </div>

      {/* HERO SECTION */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
        <div className="h-10 w-2/3 bg-gray-300/60 rounded-xl" />
        <div className="h-5 w-1/2 bg-gray-300/60 rounded-xl" />
        <div className="h-5 w-1/3 bg-gray-300/40 rounded-xl" />
      </div>

      {/* CATEGORY TABS (optional feel like menu UI) */}
      <div className="max-w-6xl mx-auto px-6 flex gap-3 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-9 w-24 bg-gray-300/50 rounded-full flex-shrink-0"
          />
        ))}
      </div>

      {/* MENU GRID */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden bg-[var(--color-surface)] border border-gray-200/40 shadow-sm"
          >
            {/* IMAGE */}
            <div className="h-40 bg-gradient-to-r from-gray-200/60 via-gray-300/40 to-gray-200/60 animate-[pulse_1.5s_ease-in-out_infinite]" />

            {/* CONTENT */}
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-gray-300/60 rounded-md" />
              <div className="h-3 w-1/2 bg-gray-300/40 rounded-md" />

              <div className="flex justify-between items-center mt-4">
                <div className="h-4 w-20 bg-gray-300/60 rounded-md" />
                <div className="h-8 w-24 bg-gray-300/50 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="mt-16 h-32 bg-[var(--color-surface)] border-t flex items-center justify-center">
        <div className="h-4 w-1/3 bg-gray-300/50 rounded-full" />
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const tenant = useTenantStore((s) => s.tenant);
  const loading = useTenantStore((s) => s.loading);
  // if (loading) {
  //   <Skeleton />
  // }

  if (!tenant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
       <Skeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] pb-24 text-[var(--color-text)] md:pb-0">
      <Header />

      <main>{children}</main>

      <Footer />

      <MobileBottomBar
        phone={tenant?.phone as string}
        whatsappNumber={tenant?.whatsappNumber as string}
      />

      <CartDrawer
        restaurantName={tenant?.restaurantName as string}
        whatsappNumber={tenant?.whatsappNumber as string}
      />
    </div>
  );
}
