import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const h = await headers();

  // Try slug from middleware-set header first
  let slug = h.get("x-debug-slug") || h.get("x-tenant-slug") || "";

  // Fallback: extract subdomain from Host header
  if (!slug) {
    const host = h.get("host") || "";
    slug = extractSubdomain(host);
  }

  if (slug) {
    redirect(`/${slug}`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900/95 p-8 shadow-2xl">
        <h1 className="text-2xl font-semibold mb-2">Restaurant not connected</h1>
        <p className="mb-6 text-slate-300">
          Please connect to the admin to register for a restaurant website.
        </p>
        <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs font-mono space-y-1">
          <p className="text-slate-400">Host header: <span className="text-yellow-300">{h.get("host") || "(none)"}</span></p>
          <p className="text-slate-400">Extracted slug: <span className="text-yellow-300">{slug}</span></p>
        </div>
      </div>
    </main>
  );
}

function extractSubdomain(host: string): string {
  const clean = host.toLowerCase().split(":")[0];
  const parts = clean.split(".");
  // Need at least 3 parts: subdomain.domain.tld (e.g. fish-station.zylobrains.com)
  // OR subdomain.localhost (e.g. fish-station.localhost)
  if (parts.length === 2 && parts[1] === "localhost") return parts[0];
  if (parts.length >= 3) {
    const first = parts[0];
    if (first !== "www") return first;
  }
  return "";
}
