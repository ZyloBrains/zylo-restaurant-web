export type MenuCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type MenuItem = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description?: string;
  imageUrl: string;
  price: number;
  isSpicy?: boolean;
  isFeatured?: boolean;
  isAvailable?: boolean;
};

export type MenuData = {
  categories: MenuCategory[];
  items: MenuItem[];
};