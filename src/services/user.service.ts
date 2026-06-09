import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api.types";
import type { UserResponse } from "@/types/auth.types";

export const userService = {
  async getProfile(slug: string): Promise<UserResponse> {
    const { data } = await api.get<ApiResponse<UserResponse>>(
      `/public/${slug}/users/profile`
    );
    return data.data;
  },
};
