import { getAuthStorageKey } from "@/lib/tenant-storage";
import { useAuthStore } from "@/features/auth/auth.store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8082/api/v1";

type RequestOptions = {
  params?: Record<string, string | number | undefined>;
  body?: unknown;
  headers?: Record<string, string>;
  silent?: boolean;
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

function isPublicPath(path: string): boolean {
  return path.startsWith("/public/") || path.startsWith("/common/");
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
  return doRequest<T>(method, path, options, false);
}

async function doRequest<T>(
  method: string,
  path: string,
  options: RequestOptions,
  skipAuth: boolean
): Promise<{ data: T; status: number }> {
  const { params, body, headers } = options;
  const token = getToken();
  const publicPath = isPublicPath(path);

  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (token && !skipAuth) {
    fetchHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(buildUrl(path, params), {
    method,
    headers: fetchHeaders,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    // A public endpoint rejected the (possibly stale) token — retry once
    // without it so public pages/cart keep working even on old backends.
    if (response.status === 401 && publicPath && token && !skipAuth) {
      return doRequest<T>(method, path, options, true);
    }

    if (typeof window !== "undefined") {
      if (response.status === 401 && !publicPath) {
        useAuthStore.getState().logout();
        throw Object.assign(new Error("Unauthorized"), { status: 401 });
      }
      if (!options.silent) {
        try {
          const { toast } = await import("sonner");
          toast.error(data?.message || `Request failed (${response.status})`);
        } catch {
          // sonner not available
        }
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
  get<T>(path: string, options?: RequestOptions): Promise<{ data: T; status: number }> {
    return request<T>("GET", path, options);
  },

  post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<{ data: T; status: number }> {
    return request<T>("POST", path, { ...options, body });
  },

  put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<{ data: T; status: number }> {
    return request<T>("PUT", path, { ...options, body });
  },

  patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<{ data: T; status: number }> {
    return request<T>("PATCH", path, { ...options, body });
  },

  delete<T>(path: string, options?: RequestOptions): Promise<{ data: T; status: number }> {
    return request<T>("DELETE", path, options);
  },
};

export default api;
