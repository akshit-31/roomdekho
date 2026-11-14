import { Link } from "react-router-dom";
import { ShieldCheck, MessageCircle } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import CompatibilityScore from "./CompatibilityScore";
import ConnectButton from "./ConnectButton";

export default function RoommateCard({ roommate, match }) {
  const prefs = roommate.preferences || {};

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/roommates/${roommate._id || roommate.userId}`} className="flex items-center gap-3">
          <img
            src={roommate.avatarUrl || defaultAvatar}
            alt={roommate.name}
            className="h-14 w-14 rounded-full object-cover"
          />
          <div>
            <p className="flex items-center gap-1 text-sm font-semibold text-gray-900">
              {roommate.name}
              {roommate.kyc?.status === "verified" && <ShieldCheck size={14} className="text-brand-500" />}
            </p>
            {(prefs.preferredLocations?.length || roommate.gender) && (
              <p className="text-xs text-gray-500">
                {roommate.gender ? `${roommate.gender} · ` : ""}
                {prefs.preferredLocations?.[0]}
              </p>
            )}
          </div>
        </Link>

        {match && <CompatibilityScore score={match.score} label={match.label} size={56} />}
      </div>

      {roommate.bio && <p className="mt-3 line-clamp-2 text-sm text-gray-600">{roommate.bio}</p>}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {prefs.food && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{prefs.food.replace("_", " ")}</span>
        )}
        {prefs.sleepSchedule && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">{prefs.sleepSchedule.replace("_", " ")}</span>
        )}
        {(prefs.budgetMin || prefs.budgetMax) && (
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
            ₹{prefs.budgetMin || 0}–{prefs.budgetMax || "?"}
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
