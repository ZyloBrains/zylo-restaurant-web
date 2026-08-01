import { MenuResponse } from "@/features/menu/menu.types";
import { menuService } from "@/services/menu.service";
import { createCachedListStore } from "@/lib/stores/create-cached-list-store";

export const useMenuListStore = createCachedListStore<MenuResponse>({
  name: "menu-list-storage",
  ttlMs: 1000 * 60 * 60 * 12, // 12 hours
  version: 1,
  fetcher: (slug) => menuService.getMenuList(slug, 0, 50),
});
