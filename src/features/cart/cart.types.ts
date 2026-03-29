export type CartItem = {
    id: string;
    menuItemId: string;

    name: string;
    price: number;
    quantity: number;

    // UI Enhancements
    imageUrl?: string;

    // Tags / Badges
    isSpicy?: boolean;
    isFeatured?: boolean;

    // Future extensibility (VERY IMPORTANT for SaaS)
    notes?: string;            // e.g. "Less spicy"
    variantId?: string;        // size/variant support later
    variantName?: string;      // e.g. "Large", "Half"
};

export type AddToCartInput = {
    menuItemId: string;

    name: string;
    price: number;

    // Optional UI
    imageUrl?: string;
    isSpicy?: boolean;
    isFeatured?: boolean;

    // Future-ready
    notes?: string;
    variantId?: string;
    variantName?: string;
};