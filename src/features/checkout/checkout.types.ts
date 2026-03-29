import type { CartItem } from "@/features/cart/cart.types";

export type CheckoutFormData = {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    customerNotes?: string;

    // future-ready fields
    orderType?: "delivery" | "pickup";
};

export type CheckoutPayload = {
    customer: {
        name: string;
        phone: string;
        address?: string;
        notes?: string;
    };

    items: CartItem[];

    pricing: {
        subtotal: number;
        deliveryFee?: number;
        total: number;
    };

    restaurantName: string;

    // future-ready
    paymentMethod?: "cod" | "online";
};