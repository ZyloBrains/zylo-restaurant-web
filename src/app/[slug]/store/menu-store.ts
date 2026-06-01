import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { itemService } from "@/services/item.service";
import { ItemResponse } from "@/features/menu/menu.types";

const TTL = 1000 * 60 * 30; // 30 minutes

type CacheEntry = {
  data: ItemResponse[];
  timestamp: number;
};

type MenuStore = {
  items: ItemResponse[];
  selectedItem: ItemResponse | null;

  cacheByTenant: Record<string, CacheEntry>;

  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchItems: (slug: string) => Promise<void>;
  fetchItemById: (slug: string, id: string) => Promise<ItemResponse | null>;

  setSelectedItem: (item: ItemResponse) => void;
  clearSelectedItem: () => void;
};

export const useMenuItemStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      items: [],
      selectedItem: null,

      cacheByTenant: {},

      loading: false,
      initialized: false,
      error: null,

      // 🔥 MAIN FETCH (STALE-WHILE-REVALIDATE)
      fetchItems: async (slug: string) => {
        const state = get();
        const now = Date.now();

        const cached = state.cacheByTenant[slug];

        // ✅ 1. FRESH CACHE (USE DIRECTLY)
        if (cached && now - cached.timestamp < TTL) {
          set({
            items: cached.data,
            initialized: true,
            loading: false,
          });
          return;
        }

        // ⚡ 2. STALE CACHE (SHOW OLD + REFRESH BACKGROUND)
        if (cached) {
          set({
            items: cached.data,
            initialized: true,
            loading: false,
          });

          // background refresh (silent update)
          itemService
            .getItemList(slug, 0, 50)
            .then((response) => {
              const limited = (response || []).slice(0, 50);

              set((state) => ({
                cacheByTenant: {
                  ...state.cacheByTenant,
                  [slug]: {
                    data: limited,
                    timestamp: Date.now(),
                  },
                },
                items: limited,
              }));
            })
            .catch((err) => {
              console.error("Background refresh failed:", err);
            });

          return;
        }

        // ❌ 3. NO CACHE → FETCH NORMAL
        try {
          set({ loading: true, error: null });

          const response = await itemService.getItemList(slug, 0, 50);
          const limited = (response || []).slice(0, 50);

          set((state) => ({
            items: limited,
            cacheByTenant: {
              ...state.cacheByTenant,
              [slug]: {
                data: limited,
                timestamp: Date.now(),
              },
            },
            loading: false,
            initialized: true,
          }));
        } catch (error) {
          console.error("Menu fetch failed", error);

          set({
            loading: false,
            error: "Failed to load menu",
          });
        }
      },

      // 🔥 ITEM DETAILS (CACHE-FIRST + FALLBACK)
      fetchItemById: async (slug: string, id: string) => {
        const state = get();

        const cached = state.items.find((i) => i.id.toString() === id);

        if (cached) {
          set({ selectedItem: cached });
          return cached;
        }

        try {
          const response = await itemService.getItemsById(
            slug,
            Number(id)
          );

          if (response) {
            set((state) => ({
              items: [...state.items, response].slice(0, 50),
              selectedItem: response,
            }));
          }

          return response ?? null;
        } catch (error) {
          console.error("Item fetch failed", error);
          return null;
        }
      },

      setSelectedItem: (item) => set({ selectedItem: item }),
      clearSelectedItem: () => set({ selectedItem: null }),
    }),
    {
      name: "menu-storage",

      storage: createJSONStorage(() => localStorage),

      // ✅ ONLY persist cache (NOT UI state)
      partialize: (state) => ({
        cacheByTenant: state.cacheByTenant,
      }),
    }
  )
);