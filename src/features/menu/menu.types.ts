export interface MenuResponse {
    id: number;
    menuName: string;
    description: string;
    active: boolean;
    imageUrl?: string;
    orderCount?: number;
}

export interface ItemResponse{
    id:number;
    name:string;
    description:string;
    price: number;
    imageUrl?:string;
    tags?:string[];
    active:boolean;
    menuName:string,
    menuId:number
}

export type MenuData = {
  items: ItemResponse[];
};