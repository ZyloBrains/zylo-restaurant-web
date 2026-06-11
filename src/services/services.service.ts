import { ServiceResponse } from "@/features/services/services.types";
import api from "@/lib/api";
import { ApiResponse, PaginationResponse } from "@/types/api.types";

export const serviceService = {
    async getServiceList(
        slug: string,
        page: number = 0,
        size: number = 20
    ): Promise<ServiceResponse[]> {
        try {
            const response = await api.get<ApiResponse<PaginationResponse<ServiceResponse>>>(
                `/public/${slug}/service/list`,
                { params: { page, size } }
            );
            return response.data?.data?.content || [];
        } catch (error) {
            console.error(`Failed to fetch services for tenant ${slug}`, error);
            return [];
        }
    },

    async getServiceById(
        slug: string,
        id: number
    ): Promise<ServiceResponse | null> {
        try {
            const response = await api.get<ApiResponse<ServiceResponse>>(`/public/${slug}/service/${id}`);
            return response.data.data;
        } catch (error) {
            console.error(`Failed to fetch service ${id} for tenant ${slug}`, error);
            return null;
        }
    },
};
