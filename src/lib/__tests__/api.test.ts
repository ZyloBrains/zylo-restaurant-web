import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api } from "@/lib/api";

const BASE = "http://localhost:8082/api";

describe("api client", () => {
  beforeEach(() => {
    // Stub fetch before each test so we don't accidentally hit the real network
    vi.stubGlobal("fetch", vi.fn());
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("performs GET request and returns { data, status }", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { id: 1, name: "test" } }),
    } as Response);

    const res = await api.get<{ id: number; name: string }>("/public/slug/items");

    // res.data is the full JSON body (which includes the ApiResponse wrapper)
    expect(res.data).toEqual({ data: { id: 1, name: "test" } });
    expect(fetchMock).toHaveBeenCalledWith(
      `${BASE}/public/slug/items`,
      expect.objectContaining({ method: "GET" })
    );
  });

  it("passes params as query string", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: [] }),
    } as Response);

    await api.get("/test", { params: { page: 0, size: 10 } });

    const callUrl = fetchMock.mock.calls[0][0] as string;
    expect(callUrl).toContain("page=0");
    expect(callUrl).toContain("size=10");
  });

  it("performs POST with JSON body", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: { id: 1 } }),
    } as Response);

    const body = { name: "test" };
    const res = await api.post("/auth/login", body);

    expect(res.data).toEqual({ data: { id: 1 } });
    expect(fetchMock.mock.calls[0][1]).toMatchObject({
      method: "POST",
      body: JSON.stringify(body),
    } as any);
  });

  it("supports PUT, PATCH, DELETE methods", async () => {
    const fetchMock = vi.mocked(fetch);
    const respond = { ok: true, json: () => Promise.resolve({ data: {} }) } as Response;

    fetchMock.mockResolvedValue(respond);

    await api.put("/resource/1", { key: "val" });
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "PUT" } as any);
    fetchMock.mockClear();

    await api.patch("/resource/1", { key: "val" });
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "PATCH" } as any);
    fetchMock.mockClear();

    await api.delete("/resource/1");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: "DELETE" } as any);
  });

  it("attaches Authorization header when token exists in scoped storage", async () => {
    // Setup tenant-scoped key
    vi.stubGlobal("window", { location: { pathname: "/test-tenant" } });
    localStorage.setItem(
      "auth-storage-test-tenant",
      JSON.stringify({ state: { token: "my-jwt-token" } })
    );

    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: {} }),
    } as Response);

    await api.get("/protected");

    const headers = (fetchMock.mock.calls[0][1] as any).headers;
    expect(headers["Authorization"]).toBe("Bearer my-jwt-token");
  });

  it("throws on non-ok response", async () => {
    const fetchMock = vi.mocked(fetch);
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ message: "Not found" }),
    } as Response);

    let caught: Error | null = null;
    try {
      await api.get("/missing");
    } catch (e) {
      caught = e as Error;
    }

    expect(caught).not.toBeNull();
    expect(caught!.message).toContain("Not found");
  });
});
