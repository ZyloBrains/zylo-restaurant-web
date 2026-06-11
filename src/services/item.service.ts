import { ItemResponse } from "@/features/menu/menu.types";
import api from "@/lib/api";
import { ApiResponse, PaginationResponse } from "@/types/api.types";

export const itemService = {
  async getItemList(
    slug: string,
    page: number = 0,
    size: number = 20,
  ): Promise<ItemResponse[]> {
    try {
      const response = await api.get<
        ApiResponse<PaginationResponse<ItemResponse>>
      >(`/public/${slug}/items/list`, {
        params: {
          page,
          size,
        },
      });

      // Safely return the content array
      return response.data?.data?.content || [];
    } catch (error) {
      console.error(`Failed to fetch items for tenant ${slug}:`, error);
      throw error;
    }
  },

  async getItemsByCategory(
    slug: string,
    categoryId: number,
    page: number = 0,
    size: number = 20,
  ): Promise<ItemResponse[]> {
    try {
      const response = await api.get<
        ApiResponse<PaginationResponse<ItemResponse>>
      >(`/public/${slug}/items/categories`, {
        params: {
          categoryId,
          page,
          size,
        },
      });

      return response.data?.data?.content || [];
    } catch (error) {
      console.error(`Failed to fetch items for tenant ${slug}:`, error);
      throw error;
    }
  },
  async getItemsById(
    slug: string,
    id:number
  ): Promise<ItemResponse> {
    try {
      const response = await api.get<
        ApiResponse<ItemResponse>
      >(`/public/${slug}/items/${id}`);

      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch items for tenant ${slug}:`, error);
      throw error;
    }
  },
};
