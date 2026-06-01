import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CategoryResponse } from "@/features/menu/menu.types";
import { CategoryService } from "@/services/category.service";

const TTL = 1000 * 60 * 60 * 12; // 12 hours

type CacheEntry = {
  data: CategoryResponse[];
  timestamp: number;
};

type MenuCategoryStore = {
  categories: CategoryResponse[];
  selectedCategory: CategoryResponse | null;

  cacheByTenant: Record<string, CacheEntry>;

  loading: boolean;
  initialized: boolean;
  error: string | null;

  fetchCategories: (slug: string) => Promise<void>;
  fetchCategoryById: (slug: string, id: string) => Promise<CategoryResponse | null>;

  setSelectedCategory: (category: CategoryResponse) => void;
  clearSelectedCategory: () => void;
};

export const useMenuCategoryStore = create<MenuCategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      selectedCategory: null,

      cacheByTenant: {},

      loading: false,
      initialized: false,
      error: null,

      // 🔥 FETCH CATEGORIES (SWR + TTL)
      fetchCategories: async (slug: string) => {
        const state = get();
        const now = Date.now();

        const cached = state.cacheByTenant[slug];

        // ✅ 1. FRESH CACHE
        if (cached && now - cached.timestamp < TTL) {
          set({
            categories: cached.data,
            initialized: true,
            loading: false,
          });
          return;
        }

        // ⚡ 2. STALE CACHE → SHOW + BACKGROUND REFRESH
        if (cached) {
          set({
            categories: cached.data,
            initialized: true,
            loading: false,
          });

          // background refresh
          CategoryService.getCategoryList(slug, 0, 50)
            .then((response) => {
              set((state) => ({
                cacheByTenant: {
                  ...state.cacheByTenant,
                  [slug]: {
                    data: response || [],
                    timestamp: Date.now(),
                  },
                },
                categories: response || [],
              }));
            })
            .catch((err) => {
              console.error("Category refresh failed:", err);
            });

          return;
        }

        // ❌ 3. NO CACHE → FETCH NORMAL
        try {
          set({ loading: true, error: null });

          const response = await CategoryService.getCategoryList(slug, 0, 50);

          set((state) => ({
            categories: response || [],
            cacheByTenant: {
              ...state.cacheByTenant,
              [slug]: {
                data: response || [],
                timestamp: now,
              },
            },
            loading: false,
            initialized: true,
          }));
        } catch (error) {
          console.error("Category fetch failed", error);

          set({
            loading: false,
            error: "Failed to load category",
          });
        }
      },

      // 🔥 CATEGORY BY ID (CACHE-FIRST)
      fetchCategoryById: async (slug: string, id: string) => {
        const state = get();

        const cached = state.categories.find(
          (c) => c.id.toString() === id
        );

        if (cached) {
          set({ selectedCategory: cached });
          return cached;
        }

        try {
          const response = await CategoryService.getCategoryById(
            slug,
            Number(id)
          );

          if (response) {
            set((state) => ({
              categories: [...state.categories, response],
              selectedCategory: response,
            }));
          }

          return response ?? null;
        } catch (error) {
          console.error("Category fetch failed", error);
          return null;
        }
      },

      setSelectedCategory: (category) =>
        set({ selectedCategory: category }),

      clearSelectedCategory: () =>
        set({ selectedCategory: null }),
    }),
    {
      name: "category-storage",

      storage: createJSONStorage(() => localStorage),

      // only persist cache
      partialize: (state) => ({
        cacheByTenant: state.cacheByTenant,
      }),
    }
  )
);