import { Link } from "react-router-dom";
import { MessageCircle, ShieldCheck, Building2, Sparkles } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import Button from "../common/Button";

export default function PropertyOwner({ owner, roomId }) {
  if (!owner) return null;

  const ownerId = owner._id || owner.id;
  const isKycVerified = owner.is_kyc_verified || owner.kyc?.status === "verified";

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 size={13} className="text-amber-400" /> Listed by Property Host
        </h2>
        {isKycVerified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
            <ShieldCheck size={11} /> Verified Host
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
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
              className="h-12 w-12 rounded-full object-cover border-2 border-slate-900"
            />
          </div>
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-900 bg-emerald-500 shadow-xs" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1 truncate text-sm font-bold text-white">
            {owner.name}
          </p>
          <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
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
