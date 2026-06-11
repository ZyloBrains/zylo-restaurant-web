import { api } from "@/lib/api";
import type { OrderNotificationPayload } from "@/types/notification.types";
import type { ApiResponse } from "@/types/api.types";

export const notificationService = {
  // async sendOrderNotification(payload: OrderNotificationPayload): Promise<void> {
  //   await api.post<ApiResponse<null>>(
  //     `/public/${payload.tenantSlug}/success`,
  //     payload
  //   );
  // },
};
