import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type { CreateOrderRequest, OrderResponse } from "@/types/order.types";

export const orderService = {
  async placeOrder(
    tenantSlug: string,
    userId: number,
    sessionId: string | null,
    request: CreateOrderRequest
  ): Promise<OrderResponse> {
    const params: Record<string, string | number> = { userId };
    if (sessionId) params.sessionId = sessionId;
    const { data } = await api.post<ApiResponse<OrderResponse>>(
      `/public/${tenantSlug}/order`,
      request,
      { params }
    );
    return data.data;
  },

  async getMyOrders(
    tenantSlug: string,
    userId: number,
    page = 0,
    size = 10
  ): Promise<OrderResponse[]> {
    const { data } = await api.get<ApiResponse<{ content: OrderResponse[] }>>(
      `/public/${tenantSlug}/order/my`,
      { params: { userId, page, size } }
    );
    return data.data.content;
  },
};
