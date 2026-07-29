import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApplicationQuery } from "../hooks/useApplicationsQuery";
import { useUpdateApplicationStatusMutation } from "../hooks/useUpdateApplicationStatusMutation";
import { DocumentViewer } from "../components/DocumentViewer";
import { StatusBadge } from "../components/StatusBadge";
import { formatDate, fullName, cn } from "@/shared/lib/utils";

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

export default function ApplicationReviewPage() {
  const { id } = useParams<{ id: string }>();
  const { data: app, isLoading, isError } = useApplicationQuery(id);
  const updateStatus = useUpdateApplicationStatusMutation(id ?? "");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (app?.reviewNotes) {
      setNotes(app.reviewNotes);
    }
  }, [app?.reviewNotes]);

  const handleStatusUpdate = async (status: string) => {
    if (!id || !app) return;
    try {
      await updateStatus.mutateAsync({ status, reviewNotes: notes });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  if (isLoading) return <div className="text-slate-400 animate-pulse">Loading application...</div>;
  if (isError || !app) return <div className="text-red-600">Application not found</div>;

  const updating = updateStatus.isPending;
  const isFinalized = app.status === "approved" || app.status === "rejected";
  const canReview = !isFinalized;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link to="/applications" className="text-xs text-brand-light hover:underline font-semibold">
            ← Back to Applications
          </Link>
          <h3 className="text-2xl font-bold text-brand-dark mt-2">{fullName(app)}</h3>
          <p className="font-mono text-sm text-brand-light mt-1">{app.referenceId}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <GroupCard title="Personal Information">
            <DetailRow label="Full Name" value={fullName(app)} span />
            <DetailRow label="Phone" value={app.phone} />
            <DetailRow label="Email" value={app.email} />
            <DetailRow label="Date of Birth" value={`${app.dob} (Age ${app.age})`} />
            <DetailRow label="Place of Birth" value={app.placeOfBirth} />
            <DetailRow label="Nationality" value={app.nationality} />
            <DetailRow label="Country of Residence" value={app.countryOfResidence} />
            <DetailRow label="TIN Number" value={app.tinNumber} />
            <DetailRow label="City / Region" value={app.cityAdministration} />
            <DetailRow label="Sub-City / Zone" value={app.subCity} />
            <DetailRow label="Woreda / Kebele" value={app.woredaKebele} />
            <DetailRow label="House Number" value={app.houseNumber} />
            <DetailRow label="Preferred Contact" value={app.preferredContact} />
          </GroupCard>

          <GroupCard title="Employment & Beneficiary">
            <DetailRow label="Employment Status" value={app.employmentStatus} />
            <DetailRow label="Has Beneficiary" value={app.hasBeneficiary ? "Yes" : "No"} />
            {app.hasBeneficiary && (
              <>
                <DetailRow label="Beneficiary Name" value={app.beneficiaryName} />
                <DetailRow label="Relationship" value={app.beneficiaryRelationship} />
              </>
            )}
          </GroupCard>

          <GroupCard title="Banking & Identity">
            <DetailRow label="Bank" value={app.bankName} />
            <DetailRow label="Branch" value={app.bankBranch} />
            <DetailRow label="Account Number" value={app.accountNumber} />
            <DetailRow label="Settlement Options" value={app.settlementOptions?.join(", ")} />
            <DetailRow label="Investor Type" value={app.investorType} />
            <DetailRow label="Fayda Number" value={app.faydaNumber} />
            <DetailRow label="Fayda Issue / Expiry" value={`${app.faydaIssueDate || "\u2014"} / ${app.faydaExpiryDate || "\u2014"}`} span />
          </GroupCard>

          <GroupCard title="Compliance & Disclosures">
            <DetailRow label="Source of Funds" value={app.sourceOfFunds} span />
            <DetailRow label="Annual Net Income" value={app.annualNetIncome} />
            <DetailRow label="Net Worth" value={app.netWorth} />
            <DetailRow label="Publicly Traded Owner" value={app.publiclyTradedOwner === "yes" ? app.publiclyTradedDetails : "No"} />
            <DetailRow label="Brokerage Employee" value={app.brokerageEmployee === "yes" ? app.brokerageEmployeeDetails : "No"} />
            <DetailRow label="PEP Status" value={app.pepStatus === "yes" ? app.pepDetails : "No"} />
            <DetailRow label="Bankruptcy" value={app.bankruptcyDisclosure === "yes" ? "Yes" : "No"} />
            <DetailRow label="Criminal Record" value={app.criminalRecord === "yes" ? "Yes" : "No"} />
          </GroupCard>

          <GroupCard title="Investment Profile">
            <DetailRow label="Risk Tolerance" value={app.riskTolerance} />
            <DetailRow label="Objectives" value={app.investmentObjective?.join(", ")} />
            <DetailRow label="Stock Experience" value={app.stockExperience} />
            <DetailRow label="Bond Experience" value={app.bondExperience} />
            <DetailRow label="Stock Monthly Volume" value={app.stockMonthlyValue} />
            <DetailRow label="Bond Monthly Volume" value={app.fixedIncomeMonthlyValue} />
          </GroupCard>

          <GroupCard title="Declaration">
            <DetailRow label="Applicant Signature" value={app.applicantName} />
            <DetailRow label="Date of Application" value={app.dateOfApplication} />
            <DetailRow label="Submitted At" value={formatDate(app.submittedAt)} />
          </GroupCard>
        </div>

        <div className="space-y-4 xl:sticky xl:top-4 xl:self-start">
          <div className="card p-5 space-y-4">
            <h4 className="font-bold text-brand-dark text-sm">Document Viewer</h4>
            <DocumentViewer label="Fayda ID (Front)" filename={app.documents.faydaFront} />
            <DocumentViewer label="Fayda ID (Back)" filename={app.documents.faydaBack} />
            <DocumentViewer label="Kebele ID" filename={app.documents.kebeleId} />
            <DocumentViewer label="Driving License" filename={app.documents.drivingLicense} />
          </div>

          <div className="card p-5 space-y-4">
            <h4 className="font-bold text-brand-dark text-sm">
              {isFinalized ? "Review Summary" : "Approval Control"}
            </h4>

            {isFinalized && (
              <div
                className={cn(
                  "rounded-xl border p-4",
                  app.status === "approved"
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-semibold",
                    app.status === "approved" ? "text-emerald-800" : "text-red-800"
                  )}
                >
                  {app.status === "approved" ? "Application Approved" : "Application Rejected"}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  No further approval actions are required for this application.
                </p>
              </div>
            )}

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              readOnly={isFinalized}
              rows={4}
              placeholder="Reviewer notes for compliance audit trail..."
              className={cn(
                "w-full px-3 py-2 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-light/40",
                isFinalized
                  ? "bg-slate-50 border-slate-200 text-slate-600 cursor-default"
                  : "bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
              )}
            />

            {canReview && (
              <div className="space-y-2">
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusUpdate("approved")}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-dark to-brand-light text-white text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  Approve Account
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusUpdate("rejected")}
                  className="w-full py-3 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusUpdate("revision_requested")}
                  className="w-full py-3 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm font-semibold hover:bg-amber-100 transition-colors disabled:opacity-50"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  disabled={updating}
                  onClick={() => handleStatusUpdate("under_review")}
                  className="w-full py-3 rounded-xl border border-slate-200 bg-white text-brand-dark text-sm font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  Mark Under Review
                </button>
              </div>
            )}

            {app.reviewedAt && (
              <p className="text-[10px] text-slate-400">
                Last reviewed {formatDate(app.reviewedAt)} by {app.reviewedBy}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
