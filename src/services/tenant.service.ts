import api from "@/lib/axios";
import { ApiResponse } from "@/types/api.types";
import { TenantResponse } from "@/types/tenant.types";

export const tenantService={
    async getTenantBySlug(slug:string):Promise<TenantResponse>{
        const response= await api.get<ApiResponse<TenantResponse>>(`/public/${slug}/tenant`);
        return response.data.data;
    },
};