import { cn } from "@/shared/lib/utils";

export const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under Review" },
  { value: "revision_requested", label: "Revision" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

export function StatusFilterTabs({
  value,
  onChange,
}: {
  value: string;
  onChange: (status: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {STATUS_FILTERS.map(({ value: v, label }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
            value === v
              ? "bg-brand-dark text-white shadow-sm"
              : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-brand-dark"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
