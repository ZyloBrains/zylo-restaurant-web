import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CachedListState<TData> = {
  data: TData[];
  cacheByTenant: Record<string, { data: TData[]; timestamp: number }>;
  loading: boolean;
  initialized: boolean;
  error: string | null;
};

export type CachedListActions = {
  fetchData: (slug: string) => Promise<void>;
};

type CreateCachedListStoreOptions<TData> = {
  name: string;
  ttlMs: number;
  fetcher: (slug: string) => Promise<TData[] | null | undefined>;
  version?: number;
};

export function createCachedListStore<TData>({
  name,
  ttlMs,
  fetcher,
  version,
}: CreateCachedListStoreOptions<TData>) {
  return create<CachedListState<TData> & CachedListActions>()(
    persist(
      (set, get) => ({
        data: [],
        cacheByTenant: {},
        loading: false,
        initialized: false,
        error: null,

        fetchData: async (slug: string) => {
          const state = get();
          const now = Date.now();
          const cached = state.cacheByTenant[slug];
          const normalize = (value: TData[] | null | undefined) => value || [];

          if (cached && now - cached.timestamp < ttlMs) {
            set({ data: cached.data, initialized: true, loading: false });
            return;
          }

          if (cached) {
            set({ data: cached.data, initialized: true, loading: false });

            fetcher(slug)
              .then((response) => {
                const normalized = normalize(response);
                set((s) => ({
                  data: normalized,
                  cacheByTenant: {
                    ...s.cacheByTenant,
                    [slug]: { data: normalized, timestamp: Date.now() },
                  },
                }));
              })
              .catch((err) => console.error("Background refresh failed:", err));
            return;
          }

          try {
            set({ loading: true, error: null });
            const response = await fetcher(slug);
            const normalized = normalize(response);
            set((s) => ({
              data: normalized,
              cacheByTenant: {
                ...s.cacheByTenant,
                [slug]: { data: normalized, timestamp: now },
              },
              loading: false,
              initialized: true,
            }));
          } catch (error) {
            console.error("Fetch failed:", error);
            set({ loading: false, error: "Failed to load data" });
          }
        },
      }),
      {
        name,
        version: version ?? 0,
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ cacheByTenant: state.cacheByTenant }),
      }
    )
  );
}
