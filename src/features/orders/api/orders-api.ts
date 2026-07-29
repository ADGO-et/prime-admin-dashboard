import { http } from "@/shared/api/http";
import type { OrdersResponse, OrderStatusResponse, TradeOrder } from "../types/order";

export const ordersApi = {
  getOrders: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return http<OrdersResponse>(`/api/admin/orders${query}`);
  },

  getOrder: (id: string) => http<TradeOrder>(`/api/admin/orders/${id}`),

  updateStatus: (id: string, body: { status: string; rejectionReason?: string }) =>
    http<OrderStatusResponse>(
      `/api/admin/orders/${id}/status`,
      { method: "PATCH", body: JSON.stringify(body) }
    ),
};
