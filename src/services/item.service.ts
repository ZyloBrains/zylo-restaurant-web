import { ItemResponse } from "@/features/menu/menu.types";
import api from "@/lib/api";
import { ApiResponse, PaginationResponse } from "@/types/api.types";

export const itemService = {
  async getTopSellingItems(
    slug: string,
    limit: number = 5,
  ): Promise<ItemResponse[]> {
    try {
      const response = await api.get<
        ApiResponse<ItemResponse[]>
      >(`/public/${slug}/items/top-selling-items`, {
        params: { limit },
      });
      return response.data?.data || [];
    } catch (error) {
      console.error(`Failed to fetch top-selling items for tenant ${slug}:`, error);
      throw error;
    }
  },

  async getTopSellingByMenu(
    slug: string,
    menuId: number,
    page: number = 0,
    size: number = 10,
  ): Promise<PaginationResponse<ItemResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PaginationResponse<ItemResponse>>
      >(`/public/${slug}/items/top-selling-by-menu`, {
        params: { menuId, page, size },
      });
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to fetch top-selling items for menu ${menuId} of tenant ${slug}:`, error);
      throw error;
    }
  },

  async searchItems(
    slug: string,
    search: string,
    page: number = 0,
    size: number = 10,
  ): Promise<PaginationResponse<ItemResponse>> {
    try {
      const response = await api.get<
        ApiResponse<PaginationResponse<ItemResponse>>
      >(`/public/${slug}/items/list`, {
        params: { search, page, size },
      });
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to search items for tenant ${slug}:`, error);
      throw error;
    }
  },

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
