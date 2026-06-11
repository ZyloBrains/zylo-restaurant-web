import api from "@/lib/api";
import { ApiResponse } from "@/types/api.types";
import { HeroImageResponse } from "@/types/hero-image.types";

export const heroImageService = {
  async getHeroImagesBySlug(slug: string): Promise<HeroImageResponse[]> {
    const response = await api.get<ApiResponse<HeroImageResponse[]>>(`/public/${slug}/hero-images`);
    return response.data.data;
  },
};
