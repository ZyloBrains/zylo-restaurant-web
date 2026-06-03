export type AuthRequest = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  userType: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: string;
  tenantCode?: string | null;
  tenantSlug?: string | null;
};

export type AuthResponse = {
  token: string;
  type: string;
  expiresIn: number;
  user: AuthUser;
};
