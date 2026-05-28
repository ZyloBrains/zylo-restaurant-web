export interface CategoryResponse{
    id:number;
    categoryName:string;
    categoryDescription:string;
    menuName:string,
    menuId:number
}

export interface ItemResponse{
    id:number;
    name:string;
    description:string;
    price: number;
    imageUrl?:string;
    tags?:string[];
    active:boolean;
    categoryName:string,
    categoryId:number,
    menuName:string
}

export type MenuData = {
  categories: CategoryResponse[];
  items: ItemResponse[];
};