"use client";

import { useEffect, useState, useCallback } from "react";
import { User, LogOut, Package, ChevronDown, Loader2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/auth.store";
import { useTenantStore } from "@/features/tenant/tenant.store";
import type { OrderResponse } from "@/types/order.types";

const PAGE_SIZE = 10;

export function UserDropdown() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const slug = useTenantStore((s) => s.tenantSlug) ?? "";

  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handler = () => setRefreshKey((k) => k + 1);
    window.addEventListener("order-placed", handler);
    return () => window.removeEventListener("order-placed", handler);
  }, []);

  const fetchOrders = useCallback(async (pageNum: number, append: boolean) => {
    if (!slug || !user) return;
    const setLoading = append ? setLoadingMore : setLoadingOrders;
    setLoading(true);
    setOrdersError("");
    try {
      const { orderService } = await import("@/services/order.service");
      const data = await orderService.getMyOrders(slug, user.id, pageNum, PAGE_SIZE);
      if (append) {
        setOrders((prev) => [...prev, ...data]);
      } else {
        setOrders(data);
      }
      setPage(pageNum);
      setHasMore(data.length === PAGE_SIZE);
    } catch (e) {
      setOrdersError(e instanceof Error ? e.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [slug, user]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      setOrders([]);
      setPage(0);
      setHasMore(true);
      fetchOrders(0, false);
    }
  };

  const handleSeeMore = () => {
    if (loadingMore || !hasMore) return;
    fetchOrders(page + 1, true);
  };

  useEffect(() => {
    if (!open) return;
    setOrders([]);
    setPage(0);
    setHasMore(true);
    fetchOrders(0, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "text-green-600 dark:text-green-400";
      case "cancelled":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
        style={{ backgroundColor: "var(--color-primary)", color: "white" }}
      >
        <User size={18} />
        <span className="max-w-[120px] truncate">{user.email}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div
            className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border shadow-xl"
            style={{
              backgroundColor: "var(--color-card)",
              borderColor: "var(--color-border, #e5e7eb)",
            }}
          >
            {/* User Info */}
            <div className="p-4 border-b" style={{ borderColor: "var(--color-border, #e5e7eb)" }}>
              <p className="font-semibold text-[var(--color-text)]">{user.name}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
              {user.phone && (
                <p className="text-sm text-[var(--color-text-muted)]">{user.phone}</p>
              )}
            </div>

            {/* Orders */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package size={16} className="text-[var(--color-primary)]" />
                <span className="text-sm font-semibold text-[var(--color-text)]">My Orders</span>
              </div>

              {loadingOrders && (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-3">
                  Loading orders...
                </p>
              )}

              {ordersError && (
                <p className="text-sm text-red-500 text-center py-3">{ordersError}</p>
              )}

              {!loadingOrders && !ordersError && orders.length === 0 && (
                <p className="text-sm text-[var(--color-text-muted)] text-center py-3">
                  No orders yet
                </p>
              )}

              {orders.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-2 rounded-lg text-sm"
                      style={{ backgroundColor: "var(--color-background, #f9fafb)" }}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-[var(--color-text)]">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {new Date(order.orderedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs font-medium text-[var(--color-text)]">
                          Rs.{order.totalAmount}
                        </span>
                        <span className={`text-[11px] font-medium uppercase ${statusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingOrders && !ordersError && orders.length > 0 && (
                <div className="mt-3 text-center">
                  {loadingMore ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Loader2 size={12} className="animate-spin" />
                      Loading...
                    </span>
                  ) : hasMore ? (
                    <button
                      onClick={handleSeeMore}
                      className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                    >
                      <ChevronDown size={14} />
                      See more
                    </button>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)]">
                      No more orders
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Logout */}
            <div className="border-t p-2" style={{ borderColor: "var(--color-border, #e5e7eb)" }}>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
