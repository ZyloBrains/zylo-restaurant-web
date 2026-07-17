import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "zylobrains.com";
const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8082/api/v1";
const RESERVED_SLUGS = new Set(["www", "app", "api", "admin"]);

const domainCache = new Map<string, { slug: string | null; exp: number }>();
const CACHE_TTL_MS = 60_000;

function getSubdomainSlug(host: string): string | null {
  const clean = host.toLowerCase().split(":")[0];
  if (clean.endsWith(".localhost")) {
    const subdomain = clean.slice(0, clean.length - ".localhost".length);
    if (subdomain && !RESERVED_SLUGS.has(subdomain)) return subdomain;
  }
  if (!clean.endsWith(`.${ROOT_DOMAIN}`)) return null;
  const subdomain = clean.slice(0, clean.length - ROOT_DOMAIN.length - 1);
  if (!subdomain || RESERVED_SLUGS.has(subdomain)) return null;
  return subdomain;
}

async function getSlugFromCustomDomain(host: string): Promise<string | null> {
  const now = Date.now();
  const cached = domainCache.get(host);
  if (cached && cached.exp > now) return cached.slug;
  try {
    const res = await fetch(
      `${BACKEND_API_URL}/common/domain/${encodeURIComponent(host)}`,
      { method: "GET", headers: { "Content-Type": "application/json" }, next: { revalidate: 60 } }
    );
    if (!res.ok) {
      domainCache.set(host, { slug: null, exp: now + 30_000 });
      return null;
    }
    const data = await res.json();
    const slug = data?.tenant_slug ?? null;
    domainCache.set(host, { slug, exp: now + CACHE_TTL_MS });
    return slug;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = (request.headers.get("host") || "").toLowerCase();
  const path = url.pathname;

  let tenantSlug = getSubdomainSlug(host);

  if (!tenantSlug) {
    tenantSlug = await getSlugFromCustomDomain(host);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-debug-host", host);
  requestHeaders.set("x-debug-slug", tenantSlug || "");

  if (!tenantSlug) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  requestHeaders.set("x-tenant-slug", tenantSlug);

  if (path === `/${tenantSlug}` || path.startsWith(`/${tenantSlug}/`)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  url.pathname = path === "/" ? `/${tenantSlug}` : `/${tenantSlug}${path}`;
  const response = NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  response.cookies.set("x-tenant-slug", tenantSlug, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export const config = {
  matcher: "/((?!_next|_static|api|_vercel|favicon\\.ico).*)",
};
