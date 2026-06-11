import { api } from "@/lib/api";
import type { ApiResponse } from "@/types/api.types";
import type {
  EsewaPaymentResponse,
  KhaltiPaymentResponse,
  CashPaymentResponse,
} from "@/features/payment/payment.types";

type InitiatePaymentPayload = {
  amount: number;
  orderId: string;
  userId?: number;
  description: string;
};

export const paymentService = {
  async initiateEsewa(
    tenantSlug: string,
    payload: InitiatePaymentPayload
  ): Promise<EsewaPaymentResponse> {
    const { data } = await api.post<ApiResponse<EsewaPaymentResponse>>(
      `/public/${tenantSlug}/users/payments/esewa/initiate`,
      payload
    );
    return data.data;
  },

  async verifyEsewa(
    tenantSlug: string,
    transaction_uuid: string,
    total_amount: string
  ): Promise<{ message: string }> {
    const { data } = await api.get<ApiResponse<{ message: string }>>(
      `/public/${tenantSlug}/users/payments/esewa/verify`,
      { params: { transaction_uuid, total_amount } }
    );
    return data.data;
  },

  async initiateKhalti(
    tenantSlug: string,
    payload: InitiatePaymentPayload
  ): Promise<KhaltiPaymentResponse> {
    const { data } = await api.post<ApiResponse<KhaltiPaymentResponse>>(
      `/public/${tenantSlug}/users/payments/khalti/initiate`,
      payload
    );
    return data.data;
  },

  async verifyKhalti(
    tenantSlug: string,
    pidx: string
  ): Promise<{ message: string }> {
    const { data } = await api.get<ApiResponse<{ message: string }>>(
      `/public/${tenantSlug}/users/payments/khalti/verify`,
      { params: { pidx } }
    );
    return data.data;
  },

  async initiateCash(
    tenantSlug: string,
    payload: InitiatePaymentPayload
  ): Promise<CashPaymentResponse> {
    const { data } = await api.post<ApiResponse<CashPaymentResponse>>(
      `/public/${tenantSlug}/users/payments/cash/initiate`,
      payload
    );
    return data.data;
  },

  async confirmCash(
    tenantSlug: string,
    transactionId: string
  ): Promise<{ message: string }> {
    const { data } = await api.post<ApiResponse<{ message: string }>>(
      `/public/${tenantSlug}/users/payments/cash/confirm/${transactionId}`
    );
    return data.data;
  },
};
