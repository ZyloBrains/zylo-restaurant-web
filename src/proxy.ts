import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "myorg.com";

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";
  let tenantSlug: string | null = null;

  if (host.includes(ROOT_DOMAIN)) {
    const parts = host.replace("www.", "").split(".");

    if (parts.length > 2) {
      tenantSlug = parts[0];
    }
  } else if (host.includes("localhost") || host.includes("127.0.0.1")) {
    const pathSegments = url.pathname.split("/").filter(Boolean);
    tenantSlug = pathSegments[0] || null;
  }

  if (url.pathname === "/" || url.pathname === "") {
    return NextResponse.next();
  }

  if (tenantSlug && tenantSlug !== "www" && tenantSlug !== "app") {
    url.pathname = `/${tenantSlug}${url.pathname.replace(`/${tenantSlug}`, "") || "/"}`;

    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

//Match All routes except static files
export const config = {
  matcher: ["/((?!_next|_static|api|_vercel|favicon.ico).*)"],
};
