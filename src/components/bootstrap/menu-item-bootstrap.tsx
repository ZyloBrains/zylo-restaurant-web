'use client';

import { useMenuItemStore} from "@/app/[slug]/store/menu-store";
import { useEffect } from "react";

export function MenuItemBootStrap({
    slug,
}:{
    slug:string
}){
   
    const fetchMenus=useMenuItemStore((s)=>s.fetchItems)
    useEffect(()=>{
        if(!slug) return;
        fetchMenus(slug);
    },[slug,fetchMenus]);
    return null;
}