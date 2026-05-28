import { tenantService } from "@/services/tenant.service";
import { TenantResponse, TenantTheme } from "@/types/tenant.types"
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TenantStore={

    //State
    tenant:TenantResponse | null;
    tenantSlug: string | null;
    tenantTheme:TenantTheme|null;
    loading: boolean;
    initialized: boolean;
    error: string|null;

    //Actions
    fetchTenant:(slug:string)=>Promise<void>;
    setTenant:(tenant: TenantResponse)=>void;
    clearTenant:()=>void;

};

export const useTenantStore= create<TenantStore>()(
    persist(
        (set,get)=>({
            tenant:null,
            tenantSlug: null,
            tenantTheme:null,

            loading: false,
            initialized: false,
            error: null,

            //FETCH TENANT
            fetchTenant: async(slug:string)=>{
                const state = get();

                //Cache Check
                //prevent duplicate API calls

                if(
                    state.initialized &&
                    state.tenant &&
                    state.tenantSlug === slug
                ){
                    return;
                }

                try{
                    set({
                        loading: true,
                        error: null,
                    });

                    const response = await tenantService.getTenantBySlug(slug);

                    //APPLY THEME VARIABLES

                    if(response.theme && typeof window !== "undefined"){
                        const root = document.documentElement;

                        root.style.setProperty(
                            "--color-primary",
                            response.theme.colorPrimary || "#0A2540"
                        );
                        root.style.setProperty(
                            "--color-secondary",
                            response.theme.colorSecondary || "#00696E"
                        );

                        root.style.setProperty(
                            "--color-accent",
                            response.theme.colorAccent || "#6FF6FF"
                        );

                        root.style.setProperty(
                            "--color-background",
                            response.theme.colorBackground || "#FFFFFF"
                        )
                         root.style.setProperty(
              "--color-surface",
              response.theme.colorSurface || "#F8FAFC"
            );

            root.style.setProperty(
              "--color-text",
              response.theme.colorText || "#0F172A"
            );

            root.style.setProperty(
              "--color-text-muted",
              response.theme.colorTextMuted || "#64748B"
            );

            root.style.setProperty(
              "--radius-button",
              response.theme.radiusButton || "12px"
            );

            root.style.setProperty(
              "--radius-card",
              response.theme.radiusCard || "20px"
            );

            root.style.setProperty(
              "--shadow-card",
              response.theme.shadowCard ||
                "0 10px 30px rgba(0,0,0,0.08)"
            );
                    
        }

        set({
            tenant:response,
            tenantSlug: slug,
            tenantTheme: response.theme || null,

            loading: false,
            initialized: true,
            error: null,
        });
                }catch(error){
                    console.error("Tenant fetch failed",error);

                    set({
                        loading: false,
                        initialized: true,
                        error: 'Failed to load tenant',
                    });
                }
            },

            setTenant:(tenant:TenantResponse)=>{
                set({
                    tenant,
                    tenantSlug: tenant.tenantSlug,
                    tenantTheme: tenant.theme || null,
                    initialized: true,
                    error: null,
                });
            },
            clearTenant:()=>{
                set({
                    tenant:null,
                    tenantSlug: null,
                    tenantTheme: null,

                    loading: false,
                    initialized: false,
                    error: null,
                });
            },
        }),
        {
            name: 'tenant-storage',
            storage: createJSONStorage(()=>localStorage),
            partialize:(state)=>({
                tenant: state.tenant,
                tenantSlug: state.tenantSlug,
                tenantTheme: state.tenantTheme
            }),
        }
        
    )
);