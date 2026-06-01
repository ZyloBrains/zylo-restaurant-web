'use client';

import { useMenuCategoryStore } from "@/app/[slug]/store/menu-category-store"
import { useEffect } from "react";

export function MenuCategoryBootStrap({
    slug,
}:{
    slug:string
}){
    const fetchCategories=useMenuCategoryStore((s)=>s.fetchCategories);

    useEffect(()=>{
        if(!slug) return;
        fetchCategories(slug);
    },[slug,fetchCategories]);
    return null;
}
