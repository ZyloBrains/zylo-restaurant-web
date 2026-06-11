import { describe, it, expect, vi, beforeEach } from "vitest";
import { useTenantStore } from "@/features/tenant/tenant.store";
import { tenantService } from "@/services/tenant.service";

vi.mock("@/services/tenant.service", () => ({
  tenantService: {
    getTenantBySlug: vi.fn(),
  },
}));

const mockTenant = {
  name: "Test",
  slug: "test-slug",
  theme: {
    primaryColor: "#000",
    secondaryColor: "#fff",
    accentColor: "#f00",
    backgroundColor: "#eee",
    surfaceColor: "#ddd",
    textColor: "#111",
    textMutedColor: "#666",
    buttonRadius: "8px",
    cardRadius: "12px",
    cardShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "Inter",
  },
  logoUrl: "/logo.png",
  faviconUrl: "/favicon.ico",
  contactEmail: "a@b.com",
  contactPhone: "123",
  address: "addr",
  openingHours: "9-5",
  socialLinks: {},
} as any;

describe("tenant.store", () => {
  beforeEach(() => {
    useTenantStore.setState({
      tenant: null,
      tenantSlug: null,
      tenantTheme: null,
      cache: {},
      darkModeBySlug: {},
      loading: false,
      error: null,
    });
    localStorage.clear();
  });

  it("initial state", () => {
    const s = useTenantStore.getState();
    expect(s.tenant).toBeNull();
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
  });

  it("fetchTenant with fresh cache returns immediately", async () => {
    vi.stubGlobal("document", { documentElement: { style: { setProperty: vi.fn(), removeProperty: vi.fn() }, setAttribute: vi.fn(), removeAttribute: vi.fn() } });

    useTenantStore.setState({
      cache: {
        "test-slug": { data: mockTenant, timestamp: Date.now() },
      },
    });

    await useTenantStore.getState().fetchTenant("test-slug");

    const s = useTenantStore.getState();
    expect(s.tenant).toEqual(mockTenant);
    expect(s.tenantSlug).toBe("test-slug");
    // No API call since cache is fresh
    expect(tenantService.getTenantBySlug).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });

  it("fetchTenant without cache calls api", async () => {
    vi.stubGlobal("document", { documentElement: { style: { setProperty: vi.fn(), removeProperty: vi.fn() }, setAttribute: vi.fn(), removeAttribute: vi.fn() } });

    (tenantService.getTenantBySlug as any).mockResolvedValue(mockTenant);

    await useTenantStore.getState().fetchTenant("test-slug");

    const s = useTenantStore.getState();
    expect(s.tenant).toEqual(mockTenant);
    expect(s.tenantSlug).toBe("test-slug");
    expect(tenantService.getTenantBySlug).toHaveBeenCalledWith("test-slug");

    vi.unstubAllGlobals();
  });

  it("clearTenant resets state", () => {
    useTenantStore.setState({
      tenant: mockTenant,
      tenantSlug: "slug",
    });
    useTenantStore.getState().clearTenant();
    const s = useTenantStore.getState();
    expect(s.tenant).toBeNull();
    expect(s.tenantSlug).toBeNull();
    expect(s.loading).toBe(false);
    expect(s.error).toBeNull();
  });

  it("toggleDarkMode switches dark mode for current tenant", () => {
    vi.stubGlobal("document", { documentElement: { style: { setProperty: vi.fn(), removeProperty: vi.fn() }, setAttribute: vi.fn(), removeAttribute: vi.fn() } });

    useTenantStore.setState({
      tenant: mockTenant,
      tenantSlug: "test-slug",
      tenantTheme: mockTenant.theme,
    });

    expect(useTenantStore.getState().darkModeBySlug["test-slug"]).toBeUndefined();

    useTenantStore.getState().toggleDarkMode();
    expect(useTenantStore.getState().darkModeBySlug["test-slug"]).toBe(true);

    useTenantStore.getState().toggleDarkMode();
    expect(useTenantStore.getState().darkModeBySlug["test-slug"]).toBe(false);

    vi.unstubAllGlobals();
  });
});
