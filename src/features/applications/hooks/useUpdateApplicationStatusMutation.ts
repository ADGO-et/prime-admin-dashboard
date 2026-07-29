import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dashboardQueryKeys } from "@/features/dashboard/hooks/query-keys";
import { applicationsApi } from "../api/applications-api";
import { applicationsQueryKeys } from "./query-keys";

export function useUpdateApplicationStatusMutation(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { status: string; reviewNotes?: string }) =>
      applicationsApi.updateStatus(id, body),
    onSuccess: (result) => {
      queryClient.setQueryData(applicationsQueryKeys.detail(id), result.application);
      queryClient.invalidateQueries({ queryKey: applicationsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.stats });
    },
  });
}
