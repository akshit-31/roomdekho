import { Link } from "react-router-dom";
import { ShieldCheck, MessageCircle } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import CompatibilityScore from "./CompatibilityScore";
import ConnectButton from "./ConnectButton";

export default function RoommateCard({ roommate, match }) {
  const prefs = roommate.preferences || {};

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-xl transition-all hover:border-amber-400/40 hover:shadow-2xl text-white">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/roommates/${roommate._id || roommate.userId}`} className="flex items-center gap-3">
          <img
            src={roommate.avatarUrl || defaultAvatar}
            alt={roommate.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = defaultAvatar;
            }}
            className="h-14 w-14 rounded-full object-cover border-2 border-slate-900 ring-2 ring-amber-500/40"
          />
          <div>
            <p className="flex items-center gap-1.5 text-sm sm:text-base font-extrabold text-white">
              {roommate.name}
              {roommate.kyc?.status === "verified" && <ShieldCheck size={14} className="text-amber-400" />}
            </p>
            {(prefs.preferredLocations?.length || roommate.gender) && (
              <p className="text-xs text-slate-400 mt-0.5">
                {roommate.gender ? `${roommate.gender} · ` : ""}
                {prefs.preferredLocations?.[0]}
              </p>
            )}
          </div>
        </Link>

        {match && <CompatibilityScore score={match.score} label={match.label} size={56} />}
      </div>

      {roommate.bio && <p className="mt-3 line-clamp-2 text-xs sm:text-sm text-slate-300 leading-relaxed">{roommate.bio}</p>}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {prefs.food && (
          <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">{prefs.food.replace("_", " ")}</span>
        )}
        {prefs.sleepSchedule && (
          <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-xs font-semibold text-slate-200">{prefs.sleepSchedule.replace("_", " ")}</span>
        )}
        {Boolean(prefs.budgetMin || prefs.budgetMax) && (
          <span className="rounded-full bg-white/10 border border-white/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
            ₹{prefs.budgetMin || 0}–{prefs.budgetMax || "Flexible"}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <div className="flex-1">
          <ConnectButton
            matchId={match?._id}
            userId={roommate._id || roommate.userId}
            status={match?.status}
          />
        </div>
        <Link
          to={`/chat?userId=${roommate._id || roommate.userId}`}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
          title="Direct Chat with Roommate"
        >
          <MessageCircle size={15} />
          <span>Chat</span>
        </Link>
      </div>
    </div>
  );
}
