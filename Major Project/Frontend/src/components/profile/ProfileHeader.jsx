import { Link } from "react-router-dom";
import { ShieldCheck, Pencil, Star, MapPin, Briefcase, Mail, Phone, Calendar } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";

const ROLE_LABELS = {
  seeker: "Room Seeker",
  roommate: "Roommate Finder",
  owner: "Property Owner",
  admin: "Super Admin",
};

export default function ProfileHeader({ profile }) {
  if (!profile) return null;

  const loc =
    profile.city ||
    profile.propertyCity ||
    profile.preferredLocations?.[0] ||
    "Delhi";

  const locality = profile.locality || profile.propertyLocality || "";
  const locationDisplay = locality ? `${locality}, ${loc}` : loc;

  const isVerified =
    profile.is_kyc_verified ||
    profile.kyc?.status === "verified" ||
    profile.approval_status === "approved";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-7 shadow-2xl text-white">
      {/* Decorative gradient strip */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left text-center">
          {/* Avatar with initial fallback */}
          <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-2xl overflow-hidden ring-4 ring-amber-400/30 shadow-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <span>{profile.name?.[0]?.toUpperCase() || "U"}</span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck size={13} className="text-emerald-400" /> Verified
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-300">
              <span className="rounded-lg bg-amber-500/20 px-2.5 py-0.5 font-bold text-amber-300 border border-amber-500/30">
                {ROLE_LABELS[profile.role] || profile.role}
              </span>

              {profile.occupation && (
                <span className="flex items-center gap-1 text-slate-300">
                  <Briefcase size={13} className="text-slate-400" /> {profile.occupation}
                </span>
              )}

              {locationDisplay && (
                <span className="flex items-center gap-1 text-slate-200 font-medium">
                  <MapPin size={13} className="text-amber-400" /> {locationDisplay}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="mt-2 text-xs text-slate-300 max-w-xl line-clamp-2 italic">
                "{profile.bio}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/profile/edit">
            <button className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-2.5 text-xs font-black text-white shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 border border-amber-400/40">
              <Pencil size={14} /> Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
