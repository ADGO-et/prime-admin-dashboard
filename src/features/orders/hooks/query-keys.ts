export const ordersQueryKeys = {
  all: ["orders"] as const,
  list: (params: Record<string, string>) => ["orders", "list", params] as const,
  detail: (id: string) => ["orders", "detail", id] as const,
};
