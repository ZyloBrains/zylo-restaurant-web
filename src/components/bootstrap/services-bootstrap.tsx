'use client';

import { useServicesStore } from "@/app/[slug]/store/services-store";
import { useEffect } from "react";

export function ServicesBootstrap({ slug }: { slug: string }) {
    const fetchServices = useServicesStore((s) => s.fetchServices);

    useEffect(() => {
        if (!slug) return;
        fetchServices(slug);
    }, [slug, fetchServices]);

    return null;
}
