import { useState } from "react";
import defaultAvatar from "/images/default-avatar.jpg";
import Button from "../common/Button";
import Textarea from "../common/Textarea";
import EmptyState from "../common/EmptyState";
import { adminApi } from "../../services/api/admin.api";

/**
 * Queue of pending KYC submissions — GET /admin/kyc, action via
 * PATCH /admin/kyc/:userId (server/src/modules/verification).
 */
export default function KycVerification({ submissions = [], onChanged }) {
  const [rejectingId, setRejectingId] = useState(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  if (!submissions.length) return <EmptyState title="No pending KYC submissions" />;

  const decide = async (userId, status) => {
    setLoading(true);
    try {
      await adminApi.reviewKyc(userId, { status, rejectionReason: status === "rejected" ? reason : undefined });
      onChanged?.();
    } finally {
      setLoading(false);
      setRejectingId(null);
      setReason("");
    }
  };

  return (
    <div className="space-y-3">
      {submissions.map((u) => (
        <div key={u._id} className="rounded-2xl border border-gray-100 bg-white p-4">
          <div className="flex items-center gap-3">
            <img src={u.avatarUrl || defaultAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{u.name}</p>
              <p className="text-xs capitalize text-gray-500">{u.kyc?.idType} · {u.kyc?.idNumberMasked}</p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a href={u.kyc?.idDocumentUrl} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl border border-gray-100">
              <img src={u.kyc?.idDocumentUrl} alt="ID document" className="h-28 w-full object-cover" />
            </a>
            <a href={u.kyc?.selfieUrl} target="_blank" rel="noreferrer" className="overflow-hidden rounded-xl border border-gray-100">
              <img src={u.kyc?.selfieUrl} alt="Selfie" className="h-28 w-full object-cover" />
            </a>
          </div>

          {rejectingId === u._id ? (
            <div className="mt-3 space-y-2">
              <Textarea placeholder="Reason for rejection" value={reason} onChange={(e) => setReason(e.target.value)} rows={2} />
              <div className="flex gap-2">
                <Button size="sm" variant="danger" loading={loading} onClick={() => decide(u._id, "rejected")}>Confirm reject</Button>
                <Button size="sm" variant="ghost" onClick={() => setRejectingId(null)}>Cancel</Button>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex gap-2">
              <Button size="sm" loading={loading} onClick={() => decide(u._id, "verified")}>Approve</Button>
              <Button size="sm" variant="danger" onClick={() => setRejectingId(u._id)}>Reject</Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
