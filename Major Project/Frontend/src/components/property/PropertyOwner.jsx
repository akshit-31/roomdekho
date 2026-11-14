import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck, Building2, Sparkles } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import Button from "../common/Button";

export default function PropertyOwner({ owner, roomId }) {
  if (!owner) return null;

  const ownerId = owner._id || owner.id;
  const isKycVerified = owner.is_kyc_verified || owner.kyc?.status === "verified";

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 size={13} className="text-amber-500" /> Listed by Property Host
        </h2>
        {isKycVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <ShieldCheck size={11} /> Verified Host
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
            <Sparkles size={11} /> Active Host
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-[2px]">
            <img
              src={owner.avatarUrl || owner.avatar || defaultAvatar}
              alt={owner.name}
              className="h-12 w-12 rounded-full object-cover border-2 border-white"
            />
          </div>
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-xs" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-bold text-slate-900">
            {owner.name}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online now · Fast response
          </p>
        </div>
      </div>

      <Link
        to={`/chat?roomId=${roomId}&ownerId=${ownerId}`}
        className="mt-4 block"
      >
        <Button
          className="w-full !bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600 !text-white font-extrabold shadow-sm rounded-2xl py-2.5 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <MessageCircle size={16} />
          Chat with Owner (Instant DM)
        </Button>
      </Link>
    </div>
  );
}
