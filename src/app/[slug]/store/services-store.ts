import { ServiceResponse } from "@/features/services/services.types";
import { serviceService } from "@/services/services.service";
import { createCachedListStore } from "@/lib/stores/create-cached-list-store";

export const useServicesStore = createCachedListStore<ServiceResponse>({
  name: "services-storage",
  ttlMs: 1000 * 60 * 60 * 12, // 12 hours
  fetcher: (slug) => serviceService.getServiceList(slug),
});
