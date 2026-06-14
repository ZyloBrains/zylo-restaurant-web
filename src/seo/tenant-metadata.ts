
import { getTenantCached } from "@/lib/tenant/get-tenant-cached";
import type { Metadata } from "next";

const IMAGE_BASE = (process.env.NEXT_PUBLIC_IMAGE_BASE_URL || "http://localhost:8082/api/v1/images").replace(/\/+$/, "");

function resolveImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${IMAGE_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function generateTenantMetadata(slug: string): Promise<Metadata> {
  try {
    const tenant = await getTenantCached(slug);

    const faviconUrl = resolveImageUrl(tenant.faviconUrl);
    const ogImage = resolveImageUrl(tenant.heroImageUrl);

    return {
      title: tenant.seoTitle || tenant.restaurantName,
      description: tenant.seoDescription || tenant.tagline || "Best restaurant",
      keywords: tenant.seoKeywords?.join(", "),

      icons: faviconUrl ? { icon: faviconUrl } : undefined,

      openGraph: {
        title: tenant.restaurantName,
        description: tenant.tagline || tenant.seoDescription,
        images: ogImage ? [ogImage] : [],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: tenant.restaurantName,
        description: tenant.tagline,
        images: ogImage ? [ogImage] : [],
      },
    };
  } catch (e) {
    return {
      title: "Restaurant",
      description: "Food ordering platform",
    };
  }
}