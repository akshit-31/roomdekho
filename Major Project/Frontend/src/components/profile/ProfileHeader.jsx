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
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm">
      {/* Decorative gradient strip */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600" />

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left text-center">
          {/* Avatar with initial fallback */}
          <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-2xl overflow-hidden ring-4 ring-amber-100 shadow-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
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
              <h1 className="text-xl font-bold text-slate-900">{profile.name}</h1>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                  <ShieldCheck size={13} className="text-emerald-600" /> Verified
                </span>
              )}
            </div>

            <div className="mt-1.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-600">
              <span className="rounded-lg bg-amber-50 px-2 py-0.5 font-bold text-amber-700 border border-amber-200/60">
                {ROLE_LABELS[profile.role] || profile.role}
              </span>

              {profile.occupation && (
                <span className="flex items-center gap-1 text-slate-600">
                  <Briefcase size={13} className="text-slate-400" /> {profile.occupation}
                </span>
              )}

              {locationDisplay && (
                <span className="flex items-center gap-1 text-slate-600 font-medium">
                  <MapPin size={13} className="text-amber-500" /> {locationDisplay}
                </span>
              )}
            </div>

            {profile.bio && (
              <p className="mt-2 text-xs text-slate-500 max-w-xl line-clamp-2 italic">
                "{profile.bio}"
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/profile/edit">
            <button className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all active:scale-95">
              <Pencil size={14} /> Edit Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
