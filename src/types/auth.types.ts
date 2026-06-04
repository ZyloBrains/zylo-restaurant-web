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
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userResponse: AuthUser;
};

export type UserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  userType: string;
  active: boolean;
  roles: string[];
  permissions: string[];
  tenantCode: string | null;
  tenantSlug: string | null;
};
