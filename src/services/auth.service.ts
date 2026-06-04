import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { AuthRequest, AuthResponse, RegisterInput, UserResponse } from "@/types/auth.types";

export const authService = {
  async login(input: AuthRequest): Promise<AuthResponse> {
    const { data } = await api.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      input
    );
    return data.data;
  },

  async register(slug:string,input: RegisterInput): Promise<UserResponse> {
    const { data } = await api.post<ApiResponse<UserResponse>>(
      `/public/${slug}/users/register`,
      input
    );
    return data.data;
  },
};
