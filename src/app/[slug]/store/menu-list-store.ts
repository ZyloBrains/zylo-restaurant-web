import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { MenuResponse } from "@/features/menu/menu.types";
import { menuService } from "@/services/menu.service";

const TTL = 1000 * 60 * 60 * 12; // 12 hours

type CacheEntry = {
  data: MenuResponse[];
  timestamp: number;
};

type MenuListStore = {
  menus: MenuResponse[];
  cacheByTenant: Record<string, CacheEntry>;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  fetchMenus: (slug: string) => Promise<void>;
};

export const useMenuListStore = create<MenuListStore>()(
  persist(
    (set, get) => ({
      menus: [],
      cacheByTenant: {},
      loading: false,
      initialized: false,
      error: null,

      fetchMenus: async (slug: string) => {
        const state = get();
        const now = Date.now();
        const cached = state.cacheByTenant[slug];

        if (cached && now - cached.timestamp < TTL) {
          set({ menus: cached.data, initialized: true, loading: false });
          return;
        }

        if (cached) {
          set({ menus: cached.data, initialized: true, loading: false });
          menuService
            .getMenuList(slug, 0, 50)
            .then((response) => {
              set((state) => ({
                cacheByTenant: {
                  ...state.cacheByTenant,
                  [slug]: { data: response || [], timestamp: Date.now() },
                },
                menus: response || [],
              }));
            })
            .catch((err) => console.error("Menu refresh failed:", err));
          return;
        }

        try {
          set({ loading: true, error: null });
          const response = await menuService.getMenuList(slug, 0, 50);
          set((state) => ({
            menus: response || [],
            cacheByTenant: {
              ...state.cacheByTenant,
              [slug]: { data: response || [], timestamp: now },
            },
            loading: false,
            initialized: true,
          }));
        } catch (error) {
          console.error("Menu fetch failed", error);
          set({ loading: false, error: "Failed to load menus" });
        }
      },
    }),
    {
      name: "menu-list-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cacheByTenant: state.cacheByTenant }),
    },
  ),
);
