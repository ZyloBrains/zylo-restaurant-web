import type { AuthUser } from "@/types/auth.types";

const STORAGE_KEY = "auth-storage";

function read(): { state: { user: AuthUser | null; token: string | null } } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function write(state: { user: AuthUser | null; token: string | null }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ state }));
}

export const authContext = {
  setToken(token: string) {
    const data = read();
    write({ user: data?.state?.user ?? null, token });
  },

  getToken(): string | null {
    return read()?.state?.token ?? null;
  },

  setUser(user: AuthUser) {
    const data = read();
    write({ user, token: data?.state?.token ?? null });
  },

  getUser(): AuthUser | null {
    return read()?.state?.user ?? null;
  },

  isAuthenticated(): boolean {
    return !!read()?.state?.token;
  },

  getUserId(): number | null {
    return read()?.state?.user?.id ?? null;
  },

  clearAuth() {
    localStorage.removeItem(STORAGE_KEY);
  },

  setAuth(token: string, user: AuthUser) {
    write({ user, token });
  },
};
