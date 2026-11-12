import { useState } from "react";
import { CheckCircle2, XCircle, MapPin, Phone, Mail, FileText, ShieldAlert, ShieldCheck } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import Button from "../common/Button";
import Textarea from "../common/Textarea";
import EmptyState from "../common/EmptyState";
import { adminApi } from "../../services/api/admin.api";

export default function KycVerification({ submissions = [], onChanged }) {
  const [filter, setFilter] = useState("pending"); // "pending" | "approved" | "all"
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  const decide = async (userId, status) => {
    setLoadingId(userId);
    try {
      await adminApi.reviewKyc(userId, { status, rejectionReason: status === "rejected" ? reason : undefined });
      onChanged?.();
    } finally {
      setLoadingId(null);
      setRejectingId(null);
      setReason("");
    }
  };

  const filtered = submissions.filter((u) => {
    if (filter === "pending") return u.approvalStatus === "pending";
    if (filter === "approved") return u.approvalStatus === "approved";
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3">
        <button
          onClick={() => setFilter("pending")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === "pending"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Pending Review (
          {submissions.filter((s) => s.approvalStatus === "pending").length}
          )
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === "approved"
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Approved Owners
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            filter === "all"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All Owners ({submissions.length})
        </button>
      </div>

      {!filtered.length ? (
        <EmptyState
          title={filter === "pending" ? "No pending owner registrations" : "No owners found"}
          description={
            filter === "pending"
              ? "All registered room owners have been reviewed and approved."
              : "Registered owners will show up here."
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((u) => (
            <div
              key={u._id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Owner info */}
                <div className="flex items-start gap-3">
                  <img
                    src={u.avatarUrl || defaultAvatar}
                    alt=""
                    className="h-12 w-12 rounded-xl object-cover border border-gray-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-gray-900">{u.name}</h3>
                      {u.approvalStatus === "pending" && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                          Pending Approval
                        </span>
                      )}
                      {u.approvalStatus === "approved" && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                          <ShieldCheck size={11} /> Verified & Active
                        </span>
                      )}
                      {u.approvalStatus === "rejected" && (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-700">
                          Rejected
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={12} /> {u.email}
                      </span>
                      {u.phone && (
                        <span className="flex items-center gap-1">
                          <Phone size={12} /> {u.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status / Quick Action */}
                <div className="flex items-center gap-2 shrink-0">
                  {u.approvalStatus === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        icon={CheckCircle2}
                        className="!bg-emerald-600 hover:!bg-emerald-700"
                        loading={loadingId === u._id}
                        onClick={() => decide(u._id, "approved")}
                      >
                        Approve & Activate
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        icon={XCircle}
                        loading={loadingId === u._id}
                        onClick={() => setRejectingId(u._id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}

                  {u.approvalStatus === "approved" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50 text-xs"
                      onClick={() => decide(u._id, "rejected")}
                    >
                      Revoke Approval
                    </Button>
                  )}

                  {u.approvalStatus === "rejected" && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => decide(u._id, "approved")}
                    >
                      Re-approve
                    </Button>
                  )}
                </div>
              </div>

              {/* Property Location & ID Details Cards */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                <div className="rounded-xl bg-gray-50 p-3 text-xs">
                  <p className="font-bold text-gray-700 flex items-center gap-1.5 mb-1 text-amber-700">
                    <MapPin size={13} /> Property Location Registered
                  </p>
                  <p className="font-semibold text-gray-800">
                    {u.property?.locality ? `${u.property.locality}, ` : ""}
                    {u.property?.city || "Delhi"}
                  </p>
                  <p className="text-gray-500 mt-0.5 text-[11px]">
                    {u.property?.address || "Address details on registration form"}
                  </p>
                </div>

                <div className="rounded-xl bg-gray-50 p-3 text-xs">
                  <p className="font-bold text-gray-700 flex items-center gap-1.5 mb-1 text-blue-700">
                    <FileText size={13} /> Identity & Document Verification
                  </p>
                  <p className="font-semibold text-gray-800">
                    {u.kyc?.idType || "Aadhaar Card"}
                  </p>
                  <p className="text-gray-500 mt-0.5 text-[11px]">
                    Document No: {u.kyc?.idNumberMasked || "Submitted with application"}
                  </p>
                </div>
              </div>

              {/* Rejection reason input */}
              {rejectingId === u._id && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50/50 p-3 space-y-2">
                  <p className="text-xs font-semibold text-red-800">Reason for rejecting this owner:</p>
                  <Textarea
                    placeholder="e.g. Incomplete property address or invalid ID document"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      loading={loadingId === u._id}
                      onClick={() => decide(u._id, "rejected")}
                    >
                      Confirm Rejection
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
