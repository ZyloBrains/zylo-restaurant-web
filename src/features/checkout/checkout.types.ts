import type { CartItem } from "@/features/cart/cart.types";

export type CheckoutFormData = {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    customerNotes: string;
};

export type CheckoutPayload = CheckoutFormData & {
    items: CartItem[];
    subtotal: number;
    restaurantName: string;
};