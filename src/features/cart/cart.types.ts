export type CartItem = {
  id: string;
  menuItemId: string;
  itemId: number;

  name: string;
  price: number;
  quantity: number;

  imageUrl: string;

  isSpicy?: boolean;
  isFeatured?: boolean;

  notes?: string;
  variantId?: string;
  variantName?: string;

  // Backend sync
  cartItemId?: number | null;

  // Discount
  discountPercent?: number;
  discountAmount?: number;
};

export type AddToCartInput = {
  menuItemId: string;
  itemId: number;

  name: string;
  price: number;

  imageUrl: string;

  isSpicy?: boolean;
  isFeatured?: boolean;

  notes?: string;
  variantId?: string;
  variantName?: string;
};