export type CreateOrderRequest = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  paymentMethod: string;
  promoCode?: string;
};

export type OrderItemResponse = {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  discountPercent?: number;
  discountAmount?: number;
};

export type OrderResponse = {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  promoCode?: string;
  promoDiscount?: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderedAt: string;
  items: OrderItemResponse[];
};
