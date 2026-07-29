export const applicationsQueryKeys = {
  all: ["applications"] as const,
  list: (params: Record<string, string>) => ["applications", "list", params] as const,
  detail: (id: string) => ["applications", "detail", id] as const,
};
