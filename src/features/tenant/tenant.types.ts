export type OpeningHours = Record<string, string>;

export type TenantThemeTokens = {
  colorPrimary: string;
  colorSecondary: string;
  colorAccent: string;
  colorBackground: string;
  colorSurface: string;
  colorText: string;
  colorTextMuted: string;
  radiusButton: string;
  radiusCard: string;
  shadowCard: string;
  defaultDarkMode: string;
};

export type TenantInfo = {
  tenantCode: string;
  restaurantName: string;
  tagline: string;
  description: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  area: string;
  country: string;
  mapsUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  logoUrl: string;
  faviconUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  openingHours: OpeningHours;
  theme: TenantThemeTokens;
};