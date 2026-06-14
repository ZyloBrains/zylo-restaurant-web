import { cache } from "react";
import { TenantResponse } from "@/types/tenant.types";
import { API_BASE_URL } from "@/lib/constants/env";

const API = API_BASE_URL;

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