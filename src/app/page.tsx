"use client";

import { useEffect, useState } from "react";

function getSavedTenantSlug(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const savedSlug = sessionStorage.getItem("active-tenant-slug");
    if (savedSlug && savedSlug.trim().length > 0) {
      return savedSlug;
    }
  } catch (error) {
    console.error("Failed to read active tenant slug from sessionStorage:", error);
  }

  return null;
}

export default function HomePage() {
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const slug = getSavedTenantSlug();
    if (!slug) return;

    setIsRedirecting(true);
    window.location.href = `/${slug}`;
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900/95 p-10 shadow-2xl">
        <h1 className="text-3xl font-semibold mb-4">Restaurant not connected</h1>
        <p className="mb-6 text-slate-300 leading-8">
          Please connect to the admin to register for a restaurant website.
        </p>
        {isRedirecting ? (
          <p className="text-slate-400">Redirecting to your saved restaurant page…</p>
        ) : (
          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="text-slate-400">
              If you have a restaurant slug, open it directly:
            </p>
            <code className="block wrap-break-word rounded-md bg-slate-800 p-3 text-sm text-slate-200">
              https://fish-station.zylobrains.com/&lt;restaurant-slug&gt;
            </code>
          </div>
        )}
      </div>
    </main>
  );
}
