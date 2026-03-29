export type PublicTenant = {
  tenantId: number;
  tenantCode: string;
  restaurantName: string;
  planCode: string;
  currencyCode: string;
  timezone: string;
  locale: string;
};

export type PublicRestaurant = {
  restaurantName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  area: string;
  country: string;
  mapsEmbedUrl: string;
  openingHoursJson: string;
  heroTitle: string;
  heroSubtitle: string;
  heroMediaType: string;
  heroMediaUrl: string;
  logoUrl: string;
  faviconUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

export type PublicTheme = {
  presetCode: string;
  mode: string;
  fontHeading: string;
  fontBody: string;
  tokens: string;
  version: number;
};
