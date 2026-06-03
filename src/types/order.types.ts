export type CreateOrderRequest = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  paymentMethod: string;
};

export type OrderItemResponse = {
  id: number;
  itemName: string;
  quantity: number;
  price: number;
  totalPrice: number;
};

export type OrderResponse = {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerNote?: string;
  paymentMethod: string;
  paymentStatus: string;
  orderedAt: string;
  items: OrderItemResponse[];
};
