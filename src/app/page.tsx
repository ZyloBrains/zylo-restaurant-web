"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";
const ROOT_DOMAIN = "zylobrains.com";
const RESERVED_SLUGS = ["www", "app", "api", "admin"];

function getSlugFromHostname(): string | null {
  try {
    const hostname = window.location.hostname.toLowerCase();
    if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) return null;
    if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
      const subdomain = hostname.slice(0, hostname.length - ROOT_DOMAIN.length - 1);
      if (subdomain && !RESERVED_SLUGS.includes(subdomain)) return subdomain;
    }
  } catch (e) {
    console.error("Failed to extract slug from hostname:", e);
  }
  return null;
}

function getSavedTenantSlug(): string | null {
  try {
    const savedSlug = sessionStorage.getItem("active-tenant-slug");
    if (savedSlug && savedSlug.trim().length > 0) return savedSlug;
  } catch (error) {
    console.error("Failed to read active tenant slug from sessionStorage:", error);
  }
  return null;
}

export default function HomePage() {
  const [status, setStatus] = useState<"loading" | "notFound" | "redirecting">("loading");

  useEffect(() => {
    let cancelled = false;

    async function checkTenant() {
      const slug = getSlugFromHostname() || getSavedTenantSlug();

      if (slug) {
        try {
          const res = await fetch(`${API_BASE_URL}/public/${slug}/tenant`);
          if (res.ok && !cancelled) {
            setStatus("redirecting");
            window.location.href = `/${slug}`;
            return;
          }
        } catch {
          // fall through to notFound
        }
      }

      if (!cancelled) setStatus("notFound");
    }

    checkTenant();
    return () => { cancelled = true; };
  }, []);

  if (status === "loading" || status === "redirecting") {
    return (
      <div className="min-h-screen bg-(--color-background) animate-pulse">
        <div className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)] flex items-center px-6">
          <div className="h-6 w-40 bg-[var(--color-text-muted)]/20 rounded-full" />
        </div>
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-4">
          <div className="h-10 w-2/3 bg-[var(--color-text-muted)]/20 rounded-xl" />
          <div className="h-5 w-1/2 bg-[var(--color-text-muted)]/20 rounded-xl" />
          <div className="h-5 w-1/3 bg-[var(--color-text-muted)]/10 rounded-xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-[var(--color-text-muted)]/15 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900/95 p-10 shadow-2xl">
        <h1 className="text-3xl font-semibold mb-4">Restaurant not connected</h1>
        <p className="mb-6 text-slate-300 leading-8">
          Please connect to the admin to register for a restaurant website.
        </p>
        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
          <p className="text-slate-400">
            If you have a restaurant slug, open it directly:
          </p>
          <code className="block wrap-break-word rounded-md bg-slate-800 p-3 text-sm text-slate-200">
            https://*.zylobrains.com/&lt;restaurant-slug&gt;
          </code>
        </div>
      </div>
    </main>
  );
}
