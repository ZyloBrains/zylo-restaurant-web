import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { AuthUser } from "@/types/auth.types";
import { authService } from "@/services/auth.service";
import type { RegisterInput } from "@/types/auth.types";
import { createTenantScopedStorage } from "@/lib/tenant-storage";

type AuthStore = {
  user: AuthUser | null;
  token: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (slug: string, input: RegisterInput) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: async (email: string, password: string) => {
        const res = await authService.login({ email, password });
        set({ user: res.userResponse, token: res.accessToken });
      },

      register: async (slug: string, input: RegisterInput) => {
        await authService.register(slug, input);
      },

      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => createTenantScopedStorage()),
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
