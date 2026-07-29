import { http, httpBlob } from "@/shared/api/http";
import type { ApplicationsResponse, KycApplication } from "../types/application";

export const applicationsApi = {
  getApplications: (params?: Record<string, string>) => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    return http<ApplicationsResponse>(`/api/admin/applications${qs}`);
  },

  getApplication: (id: string) => http<KycApplication>(`/api/admin/applications/${id}`),

  updateStatus: (id: string, body: { status: string; reviewNotes?: string }) =>
    http<{ success: boolean; application: KycApplication }>(
      `/api/admin/applications/${id}/status`,
      { method: "PATCH", body: JSON.stringify(body) }
    ),

  fetchDocumentBlob: (filename: string) =>
    httpBlob(`/api/admin/documents/${encodeURIComponent(filename)}`),
};
