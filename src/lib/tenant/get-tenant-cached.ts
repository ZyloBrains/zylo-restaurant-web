import { cache } from "react";
import { TenantResponse } from "@/types/tenant.types";

const API =
  process.env.NEXT_PUBLIC_API_URL;

export const getTenantCached = cache(
  async (slug: string): Promise<TenantResponse> => {
    const response = await fetch(
      `${API}/public/${slug}/tenant`,
      {
        next: {
          revalidate: 60 * 60, // 1 hour
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch tenant");
    }

    const json = await response.json();
    return json.data.data;
  }
);