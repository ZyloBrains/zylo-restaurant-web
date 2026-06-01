import { CategoryResponse } from "@/features/menu/menu.types";
import api from "@/lib/axios";
import { ApiResponse, PaginationResponse } from "@/types/api.types";

export const CategoryService={
    async getCategoryList(
        slug:string,
        page:number=0,
        size:number=20
    ): Promise<CategoryResponse[]>{
        try{
            const response= await api.get<ApiResponse<PaginationResponse<CategoryResponse>>>(`/public/${slug}/category/list`,{
                params:{
                    page,
                    size
                }
            });
           return response.data?.data?.content || [];
    
        }catch(error){
            console.error(`Failed to fetch category for tenant ${slug}`, error);
            throw error;
        }
    },
    async getCategoryById(
        slug:string,
        id:number
    ): Promise<CategoryResponse>{
        try{
            const response= await api.get<ApiResponse<CategoryResponse>>(`/public/${slug}/category/${id}`);
           return response.data.data;
    
        }catch(error){
            console.error(`Failed to fetch category for tenant ${slug}`, error);
            throw error;
        }
    },
    async getCategoryListByMenuId(
        slug:string,
        menuId:string,
        page:number=0,
        size:number=20
    ): Promise<CategoryResponse[]>{
        try{
            const response= await api.get<ApiResponse<PaginationResponse<CategoryResponse>>>(`/public/${slug}/category`,{
                params:{
                    page,
                    size
                }
            });
           return response.data?.data?.content || [];
    
        }catch(error){
            console.error(`Failed to fetch category for tenant ${slug}`, error);
            throw error;
        }
    }


}