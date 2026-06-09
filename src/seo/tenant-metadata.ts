
import { getTenantCached } from "@/lib/tenant/get-tenant-cached";
import type { Metadata } from "next";

export async function generateTenantMetadata(slug:string):Promise<Metadata>{
    try{
        const tenant = await getTenantCached(slug);

        return {
            title: tenant.seoTitle || tenant.restaurantName,
            description: tenant.seoDescription || tenant.tagline || 'Best restaurant',
            keywords: tenant.seoKeywords?.join(", "),

            icons: tenant.faviconUrl
                ? { icon: tenant.faviconUrl }
                : undefined,

            openGraph: {
                title: tenant.restaurantName,
                description: tenant.tagline || tenant.seoDescription,
                images: tenant.heroImageUrl ? [tenant.heroImageUrl] : [],
                type: 'website',
            },

            twitter: {
                card: "summary_large_image",
                title: tenant.restaurantName,
                description: tenant.tagline,
                images: tenant.heroImageUrl ? [tenant.heroImageUrl]: [],
            },
        };
    }catch(e){
        return {
            title: "Restaurant",
            description: 'Food ordering platform',
        };
    }
}