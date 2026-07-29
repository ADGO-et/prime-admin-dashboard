import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineDocumentText,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { useApplicationsQuery } from "@/features/applications/hooks/useApplicationsQuery";
import { useStatsQuery } from "../hooks/useStatsQuery";
import { StatusBadge } from "@/features/applications/components/StatusBadge";
import { formatCurrency, formatDate, fullName } from "@/shared/lib/utils";

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-light/[0.04] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-2xl font-bold text-brand-dark mt-1 tracking-tight">{value}</p>
          {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-dark/70 group-hover:bg-brand-dark/5 transition-colors shrink-0">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const statsQuery = useStatsQuery();
  const recentQuery = useApplicationsQuery({ limit: "5", page: "1" });

  const loading = statsQuery.isLoading || recentQuery.isLoading;
  const stats = statsQuery.data;
  const recent = recentQuery.data?.data ?? [];

  if (loading) {
    return <div className="text-slate-400 animate-pulse">Loading dashboard...</div>;
  }

  if (statsQuery.isError || !stats) {
    return (
      <div className="text-red-600">
        {statsQuery.error instanceof Error
          ? statsQuery.error.message
          : "Failed to load dashboard. Is the backend running on port 5000?"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-brand-dark">Overview</h3>
        <p className="text-sm text-slate-600 mt-1">Real-time KYC application metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          label="Total Applications"
          value={stats.total}
          icon={<HiOutlineDocumentText className="w-5 h-5" />}
        />
        <StatCard
          label="Pending Reviews"
          value={stats.pending + stats.underReview}
          icon={<HiOutlineClock className="w-5 h-5" />}
        />
        <StatCard
          label="Approved Accounts"
          value={stats.approved}
          icon={<HiOutlineCheckCircle className="w-5 h-5" />}
        />
        <StatCard
          label="Rejection Rate"
          value={`${stats.rejectionRate}%`}
          icon={<HiOutlineXCircle className="w-5 h-5" />}
        />
        <StatCard
          label="ESX Volume Forecast"
          value={formatCurrency(stats.monthlyVolumeForecast)}
          sub={`${stats.monthlyApplications} apps this month`}
          icon={<HiOutlineChartBar className="w-5 h-5" />}
        />
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800">Recent Applications</h4>
          <Link to="/applications" className="text-xs text-brand-light hover:underline font-medium">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 border-b border-slate-100 bg-slate-50/50">
                <th className="px-6 py-3 font-medium">Reference</th>
                <th className="px-6 py-3 font-medium">Applicant</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium">Submitted</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-400 text-sm">
                    No applications yet. Submit one from the public register form.
                  </td>
                </tr>
              ) : (
                recent.map((app) => (
                  <tr key={app.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5">
                      <Link to={`/applications/${app.id}`} className="font-mono text-brand-light hover:underline text-xs font-medium">
                        {app.referenceId}
                      </Link>
                    </td>
                    <td className="px-6 py-3.5 text-slate-800">{fullName(app)}</td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs">{formatDate(app.submittedAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
