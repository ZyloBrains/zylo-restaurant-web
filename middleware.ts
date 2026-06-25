import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "zylobrains.com";
const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8082/api/v1";
const RESERVED_SLUGS = new Set(["www", "app", "api", "admin"]);

// ─── In-memory edge cache (avoids hitting DB on every request) ───
const domainCache = new Map<string, { slug: string | null; exp: number }>();
const CACHE_TTL_MS = 60_000; // 60 seconds

// ─────────────────────────────────────────────────────────────────
// 1. Subdomain → slug
//    fish-station.zylobrains.com → "fish-station"
// ─────────────────────────────────────────────────────────────────
function getSubdomainSlug(host: string): string | null {
  const clean = host.toLowerCase().split(":")[0]; // remove port if any

  if (!clean.endsWith(`.${ROOT_DOMAIN}`)) return null;

  const subdomain = clean.slice(0, clean.length - ROOT_DOMAIN.length - 1);

  if (!subdomain || RESERVED_SLUGS.has(subdomain)) return null;

  return subdomain;
}

// ─────────────────────────────────────────────────────────────────
// 2. Custom domain → slug  (calls your Spring Boot endpoint)
//    GET /common/domain/{domain}  → { tenant_slug: "fish-station" }
// ─────────────────────────────────────────────────────────────────
async function getSlugFromCustomDomain(host: string): Promise<string | null> {
  const now = Date.now();

  // Return cached value if still fresh
  const cached = domainCache.get(host);
  if (cached && cached.exp > now) return cached.slug;

  try {
    const res = await fetch(
      `${BACKEND_API_URL}/common/domain/${encodeURIComponent(host)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        // Next.js fetch cache — revalidates every 60 s on the edge
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      // Cache the miss so we don't hammer the DB for unknown domains
      domainCache.set(host, { slug: null, exp: now + 30_000 });
      return null;
    }

    const data = await res.json(); // { tenant_slug: "fish-station" }
    const slug = data?.tenant_slug ?? null;

    domainCache.set(host, { slug, exp: now + CACHE_TTL_MS });
    return slug;
  } catch (err) {
    console.error("[middleware] custom domain lookup failed:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────
// Middleware
// ─────────────────────────────────────────────────────────────────
export async function middleware(request: NextRequest) {
  const url  = request.nextUrl.clone();
  const host = (request.headers.get("host") || "").toLowerCase();
  const path = url.pathname;

  // ── 1. Try subdomain first (fast, no network call) ─────────────
  let tenantSlug = getSubdomainSlug(host);

  // ── 2. Fall back to custom domain lookup (your Spring Boot API) ─
  if (!tenantSlug) {
    tenantSlug = await getSlugFromCustomDomain(host);
  }

  // ── 3. No tenant found → pass through (marketing site, etc.) ───
  if (!tenantSlug) {
    return NextResponse.next();
  }

  // ── 4. Rewrite /path → /[tenantSlug]/path ──────────────────────
  if (!path.startsWith(`/${tenantSlug}`)) {
    url.pathname = `/${tenantSlug}${path === "/" ? "" : path}`;

    const response = NextResponse.rewrite(url);
    // Forward slug as a header so Server Components can read it
    // without parsing the URL again
    response.headers.set("x-tenant-slug", tenantSlug);
    return response;
  }

  // Already prefixed correctly — just pass the header along
  const response = NextResponse.next();
  response.headers.set("x-tenant-slug", tenantSlug);
  return response;
}

export const config = {
  matcher: ["/((?!_next|_static|api|_vercel|favicon\\.ico).*)"],
};
