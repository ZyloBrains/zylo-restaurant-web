export type CartItem = {
  id: string;
  menuItemId: string;

  name: string;
  price: number;
  quantity: number;

  // ✅ MUST be required (prevents broken images)
  imageUrl: string;

  // UI tags
  isSpicy?: boolean;
  isFeatured?: boolean;

  // future
  notes?: string;
  variantId?: string;
  variantName?: string;
};

export type AddToCartInput = {
  menuItemId: string;

  name: string;
  price: number;

  // ✅ make required to avoid missing images
  imageUrl: string;

  isSpicy?: boolean;
  isFeatured?: boolean;

  notes?: string;
  variantId?: string;
  variantName?: string;
};