export type CartItem = {
    id: string;
    menuItemId: string;
    name: string;
    price: number;
    quantity: number;
};

export type AddToCartInput = {
    menuItemId: string;
    name: string;
    price: number;
};