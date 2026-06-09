export function getSlugFromPath(): string {
  if (typeof window === "undefined") return "default";
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
