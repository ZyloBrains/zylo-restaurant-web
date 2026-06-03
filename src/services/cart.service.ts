import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";

export type CartItemResponse = {
  id: number;
  itemId: number;
  itemName: string;
  imageUrl: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

export type CartResponse = {
  id: number;
  userId: number | null;
  sessionId: string | null;
  status: string;
  totalAmount: number;
  items: CartItemResponse[];
};

export const cartService = {
  async getActiveCart(
    slug: string,
    userId?: number,
    sessionId?: string
  ): Promise<CartResponse> {
    const { data } = await api.get<ApiResponse<CartResponse>>(
      `/public/${slug}/cart/active`,
      { params: { userId, sessionId } }
    );
    return data.data;
  },

  async addItem(
    slug: string,
    itemId: number,
    quantity: number,
    userId?: number,
    sessionId?: string
  ): Promise<CartResponse> {
    const { data } = await api.post<ApiResponse<CartResponse>>(
      `/public/${slug}/cart/add`,
      { itemId, quantity },
      { params: { userId, sessionId } }
    );
    return data.data;
  },

  async updateItem(
    cartItemId: number,
    slug:string,
    quantity: number
  ): Promise<CartResponse> {
    const { data } = await api.put<ApiResponse<CartResponse>>(
      `/public/cart/item/${cartItemId}`,
      { quantity }
    );
    return data.data;
  },

  async removeItem(
    slug:string,
    cartItemId: number): Promise<CartResponse> {
    const { data } = await api.delete<ApiResponse<CartResponse>>(
      `/public/${slug}/cart/item/${cartItemId}`
    );
    return data.data;
  },

  async clearCart(
    slug:string
    ,cartId: number): Promise<CartResponse> {
    const { data } = await api.delete<ApiResponse<CartResponse>>(
      `/public/${slug}/cart/clear/${cartId}`
    );
    return data.data;
  },

  async checkout(slug: string, cartId: number): Promise<CartResponse> {
    const { data } = await api.post<ApiResponse<CartResponse>>(
      `/public/${slug}/cart/checkout/${cartId}`
    );
    return data.data;
  },
};
