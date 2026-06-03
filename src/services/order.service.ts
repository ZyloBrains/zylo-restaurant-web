import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { CreateOrderRequest, OrderResponse } from "@/types/order.types";

export const orderService = {
  async placeOrder(
    tenantSlug: string,
    userId: number,
    request: CreateOrderRequest
  ): Promise<OrderResponse> {
    const { data } = await api.post<ApiResponse<OrderResponse>>(
      `/public/${tenantSlug}/order`,
      request,
      { params: { userId } }
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

  async getOrderById(
    tenantSlug: string,
    orderId: number
  ): Promise<OrderResponse> {
    const { data } = await api.get<ApiResponse<OrderResponse>>(
      `/public/${tenantSlug}/order/${orderId}`
    );
    return data.data;
  },

  async updateOrderPaymentStatus(
    tenantSlug: string,
    orderId: number,
    paymentStatus: string
  ): Promise<OrderResponse> {
    const { data } = await api.put<ApiResponse<OrderResponse>>(
      `/public/${tenantSlug}/order/${orderId}/paymentStatus`,
      null,
      { params: { paymentStatus } }
    );
    return data.data;
  },

  async cancelOrder(
    tenantSlug: string,
    orderId: number
  ): Promise<OrderResponse> {
    const { data } = await api.patch<ApiResponse<OrderResponse>>(
      `/public/${tenantSlug}/order/${orderId}/cancel`
    );
    return data.data;
  },
};
