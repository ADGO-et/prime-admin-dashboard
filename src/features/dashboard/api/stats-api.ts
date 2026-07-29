import { http } from "@/shared/api/http";
import type { Stats } from "../types/stats";

export const statsApi = {
  getStats: () => http<Stats>("/api/admin/stats"),
};
