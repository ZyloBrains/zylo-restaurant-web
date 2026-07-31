import { heroImageService } from "@/services/hero-image.service";
import { HeroImageResponse } from "@/types/hero-image.types";
import { createCachedListStore } from "@/lib/stores/create-cached-list-store";

export const useHeroImagesStore = createCachedListStore<HeroImageResponse>({
  name: "hero-images-storage",
  ttlMs: 1000 * 60 * 60 * 24, // 24 hours
  fetcher: (slug) => heroImageService.getHeroImagesBySlug(slug),
});
