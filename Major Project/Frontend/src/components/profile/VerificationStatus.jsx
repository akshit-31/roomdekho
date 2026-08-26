import { Link } from "react-router-dom";
import { Mail, Phone, ShieldCheck, ShieldAlert, ShieldX, ShieldQuestion } from "lucide-react";

const KYC_CONFIG = {
  not_submitted: { icon: ShieldQuestion, style: "bg-gray-100 text-gray-600", label: "Not submitted" },
  pending: { icon: ShieldAlert, style: "bg-amber-100 text-amber-700", label: "Under review" },
  verified: { icon: ShieldCheck, style: "bg-green-100 text-green-700", label: "Verified" },
  rejected: { icon: ShieldX, style: "bg-red-100 text-red-600", label: "Rejected" },
};

/**
 * Reflects User.isEmailVerified / isPhoneVerified / kyc.status
 * (server/src/modules/users/user.model.js).
 */
export default function VerificationStatus({ profile }) {
  const kyc = KYC_CONFIG[profile?.kyc?.status] || KYC_CONFIG.not_submitted;
  const KycIcon = kyc.icon;

  return (
    <div className="space-y-3 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="text-sm font-semibold text-gray-900">Verification</h2>

      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700"><Mail size={15} /> Email</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${profile?.isEmailVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {profile?.isEmailVerified ? "Verified" : "Not verified"}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700"><Phone size={15} /> Phone</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${profile?.isPhoneVerified ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
          {profile?.isPhoneVerified ? "Verified" : "Not verified"}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700"><KycIcon size={15} /> Government ID (KYC)</span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${kyc.style}`}>{kyc.label}</span>
      </div>

      {["not_submitted", "rejected"].includes(profile?.kyc?.status) && (
        <Link to="/profile/security" className="block pt-1 text-xs font-medium text-brand-600 hover:underline">
          Complete KYC verification →
        </Link>
      )}
      {profile?.kyc?.status === "rejected" && profile?.kyc?.rejectionReason && (
        <p className="text-xs text-red-500">Reason: {profile.kyc.rejectionReason}</p>
      )}
    </div>
  );
}
