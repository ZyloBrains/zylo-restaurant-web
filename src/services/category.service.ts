import type { MenuResponse } from "@/features/menu/menu.types";
import api from "@/lib/api";
import { ApiResponse, PaginationResponse } from "@/types/api.types";

export const CategoryService={
    async getCategoryList(
        slug:string,
        page:number=0,
        size:number=20
    ): Promise<MenuResponse[]>{
        try{
            const response= await api.get<ApiResponse<PaginationResponse<MenuResponse>>>(`/public/${slug}/menu/list`,{
                params:{
                    page,
                    size
                }
            });
           return response.data?.data?.content || [];
    
        }catch(error){
            console.error(`Failed to fetch menu for tenant ${slug}`, error);
            throw error;
        }
    },
    async getCategoryById(
        slug:string,
        id:number
    ): Promise<MenuResponse | null>{
        try{
            const response= await api.get<ApiResponse<MenuResponse>>(`/public/${slug}/menu/${id}`);
           return response.data.data;
    
        }catch(error){
            console.error(`Failed to fetch menu for tenant ${slug}`, error);
            throw error;
        }
    },
    async getCategoryListByMenuId(
        slug:string,
        menuId:string,
        page:number=0,
        size:number=20
    ): Promise<MenuResponse[]>{
        try{
            const response= await api.get<ApiResponse<PaginationResponse<MenuResponse>>>(`/public/${slug}/menu`,{
                params:{
                    page,
                    size
                }
            });
            console.log("Menu Data are ",response.data.data);
           return response.data?.data?.content || [];
    
        }catch(error){
            console.error(`Failed to fetch menu for tenant ${slug}`, error);
            throw error;
        }
    }


}