import { getAuthStorageKey } from "@/lib/tenant-storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api";

type RequestOptions = {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
};

function getToken(): string | null {
  try {
    const raw = localStorage.getItem(getAuthStorageKey());
    if (!raw) return null;
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
}

function buildUrl(path: string, params?: Record<string, string | number | undefined>): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, String(value));
    });
  }
  return url.toString();
}

async function request<T>(method: string, path: string, options: RequestOptions = {}): Promise<{ data: T; status: number }> {
  const { params, body, headers } = options;
  const token = getToken();

  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token) {
    fetchHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    if (typeof window !== "undefined") {
      try {
        const { toast } = await import("sonner");
        toast.error(data?.message || `Request failed (${response.status})`);
      } catch {
        // sonner not available
      }
    }
    throw Object.assign(new Error(data?.message || "Request failed"), {
      status: response.status,
      response: { data },
    });
  }

  return { data, status: response.status };
}

export const api = {
  get<T>(path: string, options?: { params?: Record<string, string | number | undefined> }): Promise<{ data: T; status: number }> {
    return request<T>("GET", path, options);
  },

  post<T>(path: string, body?: unknown, options?: { params?: Record<string, string | number | undefined> }): Promise<{ data: T; status: number }> {
    return request<T>("POST", path, { ...options, body });
  },

  put<T>(path: string, body?: unknown, options?: { params?: Record<string, string | number | undefined> }): Promise<{ data: T; status: number }> {
    return request<T>("PUT", path, { ...options, body });
  },

  patch<T>(path: string, body?: unknown, options?: { params?: Record<string, string | number | undefined> }): Promise<{ data: T; status: number }> {
    return request<T>("PATCH", path, { ...options, body });
  },

  delete<T>(path: string, options?: { params?: Record<string, string | number | undefined> }): Promise<{ data: T; status: number }> {
    return request<T>("DELETE", path, options);
  },
};

export default api;
