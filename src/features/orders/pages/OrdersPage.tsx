import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "../api/orders-api";
import { formatDate } from "@/shared/lib/utils";

function OrderStatus({ status }: { status: string }) {
  const colors: Record<string, string> = { Pending: "bg-amber-50 text-amber-700 border-amber-200", Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200", Rejected: "bg-red-50 text-red-700 border-red-200" };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${colors[status] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}>{status}</span>;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const params = useMemo(() => {
    const next: Record<string, string> = { page: String(page), limit: "15" };
    if (status !== "all") next.status = status;
    if (submittedSearch.trim()) next.search = submittedSearch.trim();
    return next;
  }, [page, status, submittedSearch]);
  const { data, isLoading, isError, error } = useQuery({ queryKey: ["orders", params], queryFn: () => ordersApi.getOrders(params) });
  const orders = data?.data ?? [];
  const totalPages = data?.pagination.totalPages ?? 1;

  return <div className="space-y-6">
    <div><h6 className="font-bold text-brand-dark">Trade Orders</h6><p className="text-sm text-slate-600 mt-1">Review submitted buy and sell orders</p></div>
    <div className="card p-4 flex flex-col sm:flex-row gap-4">
      <form onSubmit={(event) => { event.preventDefault(); setPage(1); setSubmittedSearch(search); }} className="flex-1 flex gap-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by client, order ID, symbol, or CSD account..." className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light/40" /><button type="submit" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-dark to-brand-light text-white text-sm font-bold">Search</button></form>
      <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm"><option value="all">All Statuses</option><option value="Pending">Pending</option><option value="Accepted">Accepted</option><option value="Rejected">Rejected</option></select>
    </div>
    <div className="card overflow-hidden">
      {isLoading ? <div className="p-8 text-center text-slate-400 animate-pulse">Loading orders...</div> : isError ? <div className="p-8 text-center text-red-600 text-sm">{error instanceof Error ? error.message : "Failed to load orders"}</div> : <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase tracking-wider text-slate-600 border-b border-slate-200 bg-slate-50/50"><th className="px-6 py-3">Order ID</th><th className="px-6 py-3">Client</th><th className="px-6 py-3">Symbol</th><th className="px-6 py-3">Side / Type</th><th className="px-6 py-3">Quantity</th><th className="px-6 py-3">Client signed</th><th className="px-6 py-3">Status</th><th className="px-6 py-3">Submitted</th></tr></thead><tbody>{orders.length === 0 ? <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">No orders found</td></tr>             : orders.map((order) => <tr key={order.id} onClick={() => navigate(`/orders/${order.id}`)} className="border-b border-slate-50 hover:bg-slate-50/80 cursor-pointer"><td className="px-6 py-3 font-mono text-xs text-brand-light font-semibold">{order.orderId}</td><td className="px-6 py-3"><p className="font-medium text-slate-800">{order.clientName}</p><p className="text-xs text-slate-500">{order.csdAccountNumber}</p></td><td className="px-6 py-3 font-semibold text-slate-700">{order.symbol}</td><td className="px-6 py-3 text-slate-600">{order.side} · {order.type}</td><td className="px-6 py-3 text-slate-700">{order.quantity}</td><td className="px-6 py-3 text-slate-600 text-xs">{order.clientSignatureDate || "—"}</td><td className="px-6 py-3"><OrderStatus status={order.status} /></td><td className="px-6 py-3 text-slate-500 text-xs">{formatDate(order.createdAt)}</td></tr>)}</tbody></table></div>}
      {totalPages > 1 && <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/30"><button disabled={page <= 1} onClick={() => setPage((value) => value - 1)} className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 disabled:opacity-30">Previous</button><span className="text-xs text-slate-500">Page {page} of {totalPages}</span><button disabled={page >= totalPages} onClick={() => setPage((value) => value + 1)} className="px-4 py-2 rounded-lg text-xs font-bold bg-white border border-slate-200 disabled:opacity-30">Next</button></div>}
    </div>
  </div>;
}
