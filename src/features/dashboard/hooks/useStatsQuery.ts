import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/stats-api";
import { dashboardQueryKeys } from "./query-keys";

export function useStatsQuery() {
  return useQuery({
    queryKey: dashboardQueryKeys.stats,
    queryFn: () => statsApi.getStats(),
  });
}
