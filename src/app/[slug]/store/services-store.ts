import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ServiceResponse } from "@/features/services/services.types";
import { serviceService } from "@/services/services.service";

const TTL = 1000 * 60 * 60 * 12;

type CacheEntry = {
    data: ServiceResponse[];
    timestamp: number;
};

type ServicesStore = {
    services: ServiceResponse[];
    cacheByTenant: Record<string, CacheEntry>;
    loading: boolean;
    initialized: boolean;
    error: string | null;

    fetchServices: (slug: string) => Promise<void>;
};

export const useServicesStore = create<ServicesStore>()(
    persist(
        (set, get) => ({
            services: [],
            cacheByTenant: {},
            loading: false,
            initialized: false,
            error: null,

            fetchServices: async (slug: string) => {
                const state = get();
                const now = Date.now();
                const cached = state.cacheByTenant[slug];

                if (cached && now - cached.timestamp < TTL) {
                    set({ services: cached.data, initialized: true, loading: false });
                    return;
                }

                if (cached) {
                    set({ services: cached.data, initialized: true, loading: false });
                    serviceService.getServiceList(slug).then((response) => {
                        set((state) => ({
                            cacheByTenant: {
                                ...state.cacheByTenant,
                                [slug]: { data: response || [], timestamp: Date.now() },
                            },
                            services: response || [],
                        }));
                    }).catch((err) => {
                        console.error("Services refresh failed:", err);
                    });
                    return;
                }

                try {
                    set({ loading: true, error: null });
                    const response = await serviceService.getServiceList(slug);
                    set((state) => ({
                        services: response || [],
                        cacheByTenant: {
                            ...state.cacheByTenant,
                            [slug]: { data: response || [], timestamp: now },
                        },
                        loading: false,
                        initialized: true,
                    }));
                } catch (error) {
                    console.error("Services fetch failed", error);
                    set({ loading: false, error: "Failed to load services" });
                }
            },
        }),
        {
            name: "services-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cacheByTenant: state.cacheByTenant }),
        }
    )
);
