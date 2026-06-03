export type PaymentMethod = "cash" | "esewa" | "khalti";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "cancelled";

export type EsewaPaymentResponse = {
  amount: string;
  tax_amount: string;
  total_amount: string;
  transaction_uuid: string;
  product_code: string;
  product_service_charge: string;
  product_delivery_charge: string;
  success_url: string;
  failure_url: string;
  signed_field_names: string;
  signature: string;
};

export type KhaltiPaymentResponse = {
  pidx: string;
  payment_url: string;
  expires_at: string;
  expires_in: number;
  user_fee: number;
};

export type CashPaymentResponse = {
  transactionId: string;
  amount: number;
  status: PaymentStatus;
  message: string;
};
