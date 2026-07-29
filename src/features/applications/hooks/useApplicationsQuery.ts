import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "../api/applications-api";
import { applicationsQueryKeys } from "./query-keys";

export function useApplicationsQuery(params: Record<string, string>) {
  return useQuery({
    queryKey: applicationsQueryKeys.list(params),
    queryFn: () => applicationsApi.getApplications(params),
  });
}

export function useApplicationQuery(id: string | undefined) {
  return useQuery({
    queryKey: applicationsQueryKeys.detail(id ?? ""),
    queryFn: () => applicationsApi.getApplication(id!),
    enabled: !!id,
  });
}
