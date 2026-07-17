function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getSlugFromPath(): string {
  if (typeof window === "undefined") return "default";
  const cookieSlug = getCookie("x-tenant-slug");
  if (cookieSlug) return cookieSlug;
  return window.location.pathname.split("/").filter(Boolean)[0] || "default";
}

export function getAuthStorageKey(slug?: string): string {
  const s = slug ?? (typeof window !== "undefined" ? getSlugFromPath() : "default");
  return `auth-storage-${s}`;
}

export function createTenantScopedStorage() {
  const getKey = () => getAuthStorageKey();
  return {
    getItem: (name: string) => localStorage.getItem(getKey()),
    setItem: (name: string, value: string) => localStorage.setItem(getKey(), value),
    removeItem: (name: string) => localStorage.removeItem(getKey()),
  };
}
