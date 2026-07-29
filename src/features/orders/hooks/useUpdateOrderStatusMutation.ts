import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/query-keys";
import { ordersApi } from "../api/orders-api";
import { ordersQueryKeys } from "./query-keys";

export function useUpdateOrderStatusMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { status: string; rejectionReason?: string }) =>
      ordersApi.updateStatus(id, body),
    onSuccess: (result) => {
      queryClient.setQueryData(ordersQueryKeys.detail(id), result.order);
      queryClient.invalidateQueries({ queryKey: ordersQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats });
    },
  });
}
