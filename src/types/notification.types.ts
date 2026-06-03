export type OrderNotificationPayload = {
  tenantSlug: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  customerNotes?: string;
  paymentMethod: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  restaurantName: string;
};
