import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useOrderQuery } from "../hooks/useOrdersQuery";
import { useUpdateOrderStatusMutation } from "../hooks/useUpdateOrderStatusMutation";
import { formatDate, cn } from "@/shared/lib/utils";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${statusColors[status] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}>
      {status}
    </span>
  );
}

function DetailRow({ label, value, span }: { label: string; value: React.ReactNode; span?: boolean }) {
  return (
    <div className={cn("py-2 min-w-0", span ? "col-span-2" : "")}>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
      <dd className="text-sm text-slate-800 font-medium mt-0.5 truncate">{value || "\u2014"}</dd>
    </div>
  );
}

function GroupCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <h4 className="font-bold text-brand-dark text-sm mb-3 pb-2 border-b border-slate-100">{title}</h4>
      <div className="grid grid-cols-2 gap-x-6">
        {children}
      </div>
    </div>
  );
}

export default function OrderReviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useOrderQuery(id);
  const updateStatus = useUpdateOrderStatusMutation(id ?? "");
  const [rejectionReason, setRejectionReason] = useState("");

  const order = data;

  const handleStatusUpdate = async (status: string) => {
    if (!id || !order) return;
    try {
      await updateStatus.mutateAsync({
        status,
        ...(status === "Rejected" ? { rejectionReason } : {}),
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (isLoading) return <div className="text-slate-400 animate-pulse">Loading order...</div>;
  if (isError || !order) return <div className="text-red-600">Order not found</div>;

  const updating = updateStatus.isPending;
  const isFinalized = order.status === "Accepted" || order.status === "Rejected";
  const canReview = !isFinalized;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/orders" className="text-xs text-brand-light hover:underline font-semibold">
            ← Back to Orders
          </Link>
          <h3 className="text-2xl font-bold text-brand-dark mt-2">Order {order.orderId}</h3>
          <p className="text-sm text-slate-500 mt-1">{order.clientName}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <GroupCard title="Client Information">
            <DetailRow label="Client Name" value={order.clientName} span />
            <DetailRow label="ID Number" value={order.idNumber} />
            <DetailRow label="CSD Account Number" value={order.csdAccountNumber} />
          </GroupCard>

          <GroupCard title="Order Details">
            <DetailRow label="Symbol" value={order.symbol} />
            <DetailRow label="Side" value={order.side} />
            <DetailRow label="Type" value={order.type} />
            <DetailRow label="Quantity" value={order.quantity} />
            <DetailRow label="Limit Price" value={order.limitPrice} />
            <DetailRow label="Stop Price" value={order.stopPrice} />
            <DetailRow label="Time in Force" value={order.timeInForce} />
            <DetailRow label="Good Till Date" value={order.goodTillDate} />
          </GroupCard>

          <GroupCard title="Submission">
            <DetailRow label="Received Via" value={order.receivedVia} />
            <DetailRow label="Client Signature" value={order.clientSignature} />
            <DetailRow label="Signature Date" value={order.clientSignatureDate} />
            <DetailRow label="Submitted At" value={formatDate(order.createdAt)} />
          </GroupCard>

          {order.status !== "Pending" && (
            <GroupCard title="Admin Processing">
              <DetailRow label="Trader Signature" value={order.traderSignature} />
              <DetailRow label="Received By" value={order.receivedBy} />
              <DetailRow label="Date Received" value={order.dateReceived} />
              <DetailRow label="Time Received" value={order.timeReceived} />
              <DetailRow label="Last Updated" value={formatDate(order.updatedAt)} />
              {order.rejectionReason && (
                <DetailRow label="Rejection Reason" value={order.rejectionReason} span />
              )}
            </GroupCard>
          )}
        </div>

        <div className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <div className="card p-5 space-y-4">
            <h4 className="font-bold text-brand-dark text-sm">
              {isFinalized ? "Review Summary" : "Approval Control"}
            </h4>

            {isFinalized && (
              <div
                className={cn(
                  "rounded-xl border p-4",
                  order.status === "Accepted"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold",
                    order.status === "Accepted" ? "text-emerald-800" : "text-red-800"
                  )}
                >
                  {order.status === "Accepted" ? "Order Accepted" : "Order Rejected"}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  No further actions are required for this order.
                </p>
              </div>
            )}

            {canReview && (
              <>
                <div className="space-y-2">
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleStatusUpdate("Accepted")}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-dark to-brand-light text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    Accept Order
                  </button>
                  <button
                    type="button"
                    disabled={updating}
                    onClick={() => handleStatusUpdate("Rejected")}
                    className="w-full py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    Reject Order
                  </button>
                </div>

                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Rejection reason (required when rejecting)..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-light/40"
                />
              </>
            )}

            {order.traderSignature && (
              <p className="text-[10px] text-slate-400">
                Processed by {order.traderSignature}{order.dateReceived ? ` on ${order.dateReceived}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
