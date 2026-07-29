import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders-api";
import { ordersQueryKeys } from "./query-keys";

export function useOrdersQuery(params: Record<string, string>) {
  return useQuery({
    queryKey: ordersQueryKeys.list(params),
    queryFn: () => ordersApi.getOrders(params),
  });
}

export function useOrderQuery(id: string | undefined) {
  return useQuery({
    queryKey: ordersQueryKeys.detail(id ?? ""),
    queryFn: () => ordersApi.getOrder(id!),
    enabled: !!id,
  });
}
