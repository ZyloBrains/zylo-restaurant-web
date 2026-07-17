import { MenuResponse } from "@/features/menu/menu.types";
import api from "@/lib/api";
import { ApiResponse, PaginationResponse } from "@/types/api.types";

export const menuService = {
  async getMenuList(
    slug: string,
    page: number = 0,
    size: number = 20,
  ): Promise<MenuResponse[]> {
    try {
      const response = await api.get<
        ApiResponse<PaginationResponse<MenuResponse>>
      >(`/public/${slug}/menu/list`, {
        params: { page, size },
      });
      return response.data?.data?.content || [];
    } catch (error) {
      console.error(`Failed to fetch menus for tenant ${slug}:`, error);
      throw error;
    }
  },

  async getMenuById(slug: string, id: number): Promise<MenuResponse | null> {
    try {
      const response = await api.get<ApiResponse<MenuResponse>>(
        `/public/${slug}/menu/${id}`,
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch menu ${id} for tenant ${slug}:`, error);
      return null;
    }
  },
};
