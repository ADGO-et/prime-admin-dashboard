import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApplicationsQuery } from "../hooks/useApplicationsQuery";
import { StatusBadge } from "../components/StatusBadge";
import { formatDate, fullName } from "@/shared/lib/utils";

export default function ApplicationsPage() {
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);

  const params = useMemo(() => {
    const p: Record<string, string> = { page: String(page), limit: "15" };
    if (status !== "all") p.status = status;
    if (submittedSearch.trim()) p.search = submittedSearch.trim();
    return p;
  }, [status, page, submittedSearch]);

  const { data, isLoading, isError, error } = useApplicationsQuery(params);
  const apps = data?.data ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSubmittedSearch(search);
  };

  return (
    <div className="space-y-6">
      <div>
        <h6 className="font-bold text-brand-dark">Applications Management</h6>
        <p className="text-sm text-slate-600 mt-1">Search, filter, and review KYC submissions</p>
      </div>

      <div className="card p-4 flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone, or reference ID..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-light/40 focus:border-brand-light"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-dark to-brand-light text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
          >
            Search
          </button>
        </form>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light/40"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="under_review">Under Review</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="revision_requested">Revision Requested</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading applications...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-600 text-sm">
            {error instanceof Error ? error.message : "Failed to load applications"}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-slate-600 border-b border-slate-200 bg-slate-50/50">
                  <th className="px-6 py-3">Reference ID</th>
                  <th className="px-6 py-3">Applicant Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Phone</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Submitted</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  apps.map((app) => (
                    <tr key={app.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-brand-light font-semibold">{app.referenceId}</td>
                      <td className="px-6 py-3 text-slate-800 font-medium">{fullName(app)}</td>
                      <td className="px-6 py-3 text-slate-600">{app.email}</td>
                      <td className="px-6 py-3 text-slate-600">{app.phone}</td>
                      <td className="px-6 py-3">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="px-6 py-3 text-slate-500 text-xs">{formatDate(app.submittedAt)}</td>
                      <td className="px-6 py-3">
                        <Link
                          to={`/applications/${app.id}`}
                          className="text-xs font-bold text-brand-light hover:underline"
                        >
                          Review →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/30">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
