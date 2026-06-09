export interface TenantResponse {

  id: number;

  tenantCode: string;

  restaurantName: string;

  tenantSlug: string;

  tagline?: string;

  description?: string;

  phone?: string;

  whatsappNumber?: string;

  email?: string;

  addressLine1?: string;

  addressLine2?: string;

  city?: string;

  area?: string;

  country?: string;

  mapsUrl?: string;

  facebookUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  tiktokUrl?: string;

  heroTitle?: string;

  heroSubtitle?: string;

  heroImageUrl?: string;

  logoUrl?: string;

  faviconUrl?: string;

  seoTitle?: string;

  seoDescription?: string;

  seoKeywords?: string[];

  openingHours: OpeningHours;

  theme: TenantTheme;

  active: boolean;

  createdAt: string;

  updatedAt: string;
}


export interface OpeningHours{
    days?: Record<string,string>;
}


export interface TenantTheme {
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
  defaultDarkMode: string,
}