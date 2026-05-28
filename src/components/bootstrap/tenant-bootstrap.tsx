/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import { useTenantStore } from "@/features/tenant/tenant.store"
import { useEffect } from "react";

export function TenantBootstrap({
    tenantSlug,
}:{
    tenantSlug:string
}){
    const fetchTenant=useTenantStore((s)=>s.fetchTenant);

    useEffect(()=>{
        if(!tenantSlug) return;
        fetchTenant(tenantSlug);
    },[tenantSlug]);
    return null;
}