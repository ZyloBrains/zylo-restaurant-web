import type { CartItem } from "@/features/cart/cart.types";
import type { PaymentMethod } from "@/features/payment/payment.types";

export type CheckoutFormData = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNotes: string;
  paymentMethod: PaymentMethod;
};

export type CheckoutPayload = CheckoutFormData & {
  items: CartItem[];
  subtotal: number;
  restaurantName: string;
  orderNumber: string;
};
