import { Link } from "react-router-dom";
import { ShieldCheck, Pencil, Star } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";

const ROLE_LABELS = { seeker: "Room Seeker", roommate: "Roommate", owner: "Property Owner", admin: "Admin" };

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <img src={profile.avatarUrl || defaultAvatar} alt={profile.name} className="h-20 w-20 rounded-full object-cover" />
        <div className="text-center sm:text-left">
          <h1 className="flex items-center justify-center gap-1.5 text-lg font-semibold text-gray-900 sm:justify-start">
            {profile.name}
            {profile.kyc?.status === "verified" && <ShieldCheck size={18} className="text-brand-500" />}
          </h1>
          <p className="text-sm text-gray-500">{ROLE_LABELS[profile.role] || profile.role}</p>
          {profile.reputationScore != null && (
            <p className="mt-1 flex items-center justify-center gap-1 text-xs text-amber-600 sm:justify-start">
              <Star size={13} className="fill-amber-400 text-amber-400" /> {profile.reputationScore.toFixed(1)} reputation
            </p>
          )}
        </div>
      </div>

      <Link to="/profile/edit">
        <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Pencil size={15} /> Edit profile
        </button>
      </Link>
    </div>
  );
}
