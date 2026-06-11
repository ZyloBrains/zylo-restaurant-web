import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getSlugFromPath,
  getAuthStorageKey,
  createTenantScopedStorage,
} from "@/lib/tenant-storage";

describe("getSlugFromPath", () => {
  it("returns slug from first path segment", () => {
    vi.stubGlobal("window", { location: { pathname: "/fish-station/menu" } });
    expect(getSlugFromPath()).toBe("fish-station");
    vi.unstubAllGlobals();
  });

  it("falls back to 'default' when path is root", () => {
    vi.stubGlobal("window", { location: { pathname: "/" } });
    expect(getSlugFromPath()).toBe("default");
    vi.unstubAllGlobals();
  });

  it("returns 'default' when window is undefined", () => {
    const win = globalThis.window;
    // @ts-expect-error delete window for SSR test
    delete (globalThis as any).window;
    expect(getSlugFromPath()).toBe("default");
    (globalThis as any).window = win;
  });
});

describe("getAuthStorageKey", () => {
  it("uses provided slug over window location", () => {
    vi.stubGlobal("window", { location: { pathname: "/other-slug" } });
    expect(getAuthStorageKey("my-tenant")).toBe("auth-storage-my-tenant");
    vi.unstubAllGlobals();
  });

  it("derives slug from pathname when not provided", () => {
    vi.stubGlobal("window", { location: { pathname: "/tenant-x" } });
    expect(getAuthStorageKey()).toBe("auth-storage-tenant-x");
    vi.unstubAllGlobals();
  });
});

describe("createTenantScopedStorage", () => {
  beforeEach(() => {
    vi.stubGlobal("window", { location: { pathname: "/test-slug" } });
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getItem returns null for missing key", () => {
    const storage = createTenantScopedStorage();
    expect(storage.getItem("ignored")).toBeNull();
  });

  it("setItem and getItem round-trips correctly", () => {
    const storage = createTenantScopedStorage();
    storage.setItem("ignored", '"value"');
    expect(storage.getItem("ignored")).toBe('"value"');
  });

  it("strips the name parameter and uses slug-scoped key", () => {
    const storage = createTenantScopedStorage();
    storage.setItem("whatever", "data");
    expect(localStorage.getItem("auth-storage-test-slug")).toBe("data");
    expect(localStorage.getItem("whatever")).toBeNull();
  });

  it("removeItem clears the scoped key", () => {
    localStorage.setItem("auth-storage-test-slug", "data");
    const storage = createTenantScopedStorage();
    storage.removeItem("ignored");
    expect(localStorage.getItem("auth-storage-test-slug")).toBeNull();
  });
});
