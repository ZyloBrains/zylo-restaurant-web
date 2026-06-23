import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "zylobrains.com";
const RESERVED_SLUGS = ["www", "app"];

function getTenantSlugFromHost(host: string): string | null {
  const normalized = host.replace(/^www\./i, "").toLowerCase();

  if (!normalized.endsWith(ROOT_DOMAIN)) {
    return null;
  }

  const parts = normalized.split(".");
  if (parts.length <= 2) {
    return null;
  }

  return parts.slice(0, parts.length - 2).join(".");
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  const pathname = url.pathname;

  const tenantSlug = getTenantSlugFromHost(host);

  if (!tenantSlug || RESERVED_SLUGS.includes(tenantSlug)) {
    return NextResponse.next();
  }

  if (!pathname.startsWith(`/${tenantSlug}`)) {
    url.pathname = `/${tenantSlug}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|_static|api|_vercel|favicon.ico).*)"],
};
