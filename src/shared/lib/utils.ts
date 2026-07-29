import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 0,
  }).format(n);
}

export function fullName(app: { firstName: string; fatherName: string; grandfatherName?: string }) {
  return [app.firstName, app.fatherName, app.grandfatherName].filter(Boolean).join(" ");
}
