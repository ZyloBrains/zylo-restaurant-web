import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { tenantService } from "@/services/tenant.service";
import { TenantResponse, TenantTheme } from "@/types/tenant.types";
import { normalizeThemeTokens } from "@/lib/theme/theme.tokens";

const TTL = 1000 * 60 * 60 * 24; // 24 hours

type TenantCache = {
  data: TenantResponse;
  timestamp: number;
};

type TenantStore = {
  tenant: TenantResponse | null;
  tenantSlug: string | null;
  tenantTheme: TenantTheme | null;

  cache: Record<string, TenantCache>;
  darkModeBySlug: Record<string, boolean>;

  loading: boolean;
  error: string | null;

  fetchTenant: (slug: string) => Promise<void>;
  toggleDarkMode: () => void;
  clearTenant: () => void;
};

/* ---------------- THEME APPLY ---------------- */
function applyThemeToDom(
  theme: TenantTheme | null | undefined,
  isDarkMode?: boolean
) {
  if (!theme || typeof window === "undefined") return;

  const root = document.documentElement;
  const t = normalizeThemeTokens(theme);

  root.style.setProperty("--color-primary", t.colorPrimary);
  root.style.setProperty("--color-secondary", t.colorSecondary);
  root.style.setProperty("--color-accent", t.colorAccent);

  if (isDarkMode) {
    // In dark mode, let the data-dark-mode CSS selector control structural
    // colors (text, background, surface, card, border, text-muted) for proper
    // visibility. Only brand colors and layout values are set from the tenant.
    root.setAttribute("data-dark-mode", "true");
  } else {
    // Light mode – apply the full backend tenant theme as inline styles
    root.style.setProperty("--color-background", t.colorBackground);
    root.style.setProperty("--color-surface", t.colorSurface);
    root.style.setProperty("--color-text", t.colorText);
    root.style.setProperty("--color-text-muted", t.colorTextMuted);
    root.removeAttribute("data-dark-mode");
  }

  root.style.setProperty("--radius-button", t.radiusButton);
  root.style.setProperty("--radius-card", t.radiusCard);
  root.style.setProperty("--shadow-card", t.shadowCard);
}

/* ---------------- STORE ---------------- */
export const useTenantStore = create<TenantStore>()(
  persist(
    (set, get) => ({
      tenant: null,
      tenantSlug: null,
      tenantTheme: null,

      cache: {},
      darkModeBySlug: {},

      loading: false,
      error: null,

      /* ---------------- FETCH TENANT (SWR + TTL) ---------------- */
      fetchTenant: async (slug: string) => {
        const state = get();
        const now = Date.now();

        const cached = state.cache[slug];
        const isDark = state.darkModeBySlug[slug] ?? false;

        // ✅ 1. FRESH CACHE
        if (cached && now - cached.timestamp < TTL) {
          set({
            tenant: cached.data,
            tenantSlug: slug,
            tenantTheme: cached.data.theme,
            loading: false,
          });

          applyThemeToDom(cached.data.theme, isDark);
          return;
        }

        // ⚡ 2. STALE CACHE (show old + refresh background)
        if (cached) {
          set({
            tenant: cached.data,
            tenantSlug: slug,
            tenantTheme: cached.data.theme,
            loading: false,
          });

          applyThemeToDom(cached.data.theme, isDark);

          tenantService
            .getTenantBySlug(slug)
            .then((response) => {
              set((state) => ({
                cache: {
                  ...state.cache,
                  [slug]: {
                    data: response,
                    timestamp: Date.now(),
                  },
                },
                tenant: response,
                tenantTheme: response.theme,
              }));

              applyThemeToDom(response.theme, get().darkModeBySlug[slug]);
            })
            .catch((err) => {
              console.error("Background refresh failed:", err);
            });

          return;
        }

        // ❌ 3. NO CACHE
        try {
          set({ loading: true, error: null });

          const response = await tenantService.getTenantBySlug(slug);

          set((state) => ({
            tenant: response,
            tenantSlug: slug,
            tenantTheme: response.theme,
            cache: {
              ...state.cache,
              [slug]: {
                data: response,
                timestamp: now,
              },
            },
            loading: false,
          }));

          applyThemeToDom(response.theme, state.darkModeBySlug[slug]);
        } catch (err) {
          set({
            loading: false,
            error: "Failed to load tenant",
          });
        }
      },

      /* ---------------- DARK MODE PER TENANT ---------------- */
      toggleDarkMode: () => {
        const { tenantSlug, darkModeBySlug, tenantTheme } = get();
        if (!tenantSlug) return;

        const current = darkModeBySlug[tenantSlug] ?? false;
        const next = !current;

        const updated = {
          ...darkModeBySlug,
          [tenantSlug]: next,
        };

        set({ darkModeBySlug: updated });

        applyThemeToDom(tenantTheme, next);
      },

      /* ---------------- CLEAR ---------------- */
      clearTenant: () =>
        set({
          tenant: null,
          tenantSlug: null,
          tenantTheme: null,
          loading: false,
          error: null,
        }),
    }),

    /* ---------------- PERSIST CONFIG ---------------- */
    {
      name: "tenant-cache",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        cache: state.cache,
        darkModeBySlug: state.darkModeBySlug,
      }),
    }
  )
);