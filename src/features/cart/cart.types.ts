export type CartItem = {
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;

    // optional enhancements (future-ready)
    imageUrl?: string;
    isSpicy?: boolean;
    isFeatured?: boolean;
};

export type AddToCartInput = {
    menuItemId: string;
    name: string;
    price: number;

    // optional (for UI + future features)
    imageUrl?: string;
    isSpicy?: boolean;
    isFeatured?: boolean;
};