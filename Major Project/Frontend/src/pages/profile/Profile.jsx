import { Link } from "react-router-dom";
import {
  Settings,
  Sliders,
  Lock,
  ShieldCheck,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  User,
  Briefcase,
  MapPin,
  IndianRupee,
  Utensils,
  Moon,
  Sparkles,
  Building2,
  FileText,
  Eye,
  CheckCircle2,
  Clock,
  DoorOpen,
  Users
} from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import ProfileHeader from "../../components/profile/ProfileHeader";
import VerificationStatus from "../../components/profile/VerificationStatus";
import Loader from "../../components/common/Loader";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";

const ROLE_LABELS = {
  seeker: "Room Seeker",
  roommate: "Roommate Finder",
  owner: "Property Owner",
  admin: "Super Admin",
};

export default function Profile() {
  const { profile, status } = useUser();
  const { isAuthenticated, user: authUser } = useAuth();
  const currentProfile = profile || authUser;

  const isOwner = currentProfile?.role === "owner";
  const isSeeker = currentProfile?.role === "seeker" || currentProfile?.role === "roommate";
  const memberDate = currentProfile?.created_at || currentProfile?.createdAt;
  const formattedJoinedDate = memberDate
    ? new Date(memberDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "Recently";

  const budgetMin = currentProfile?.budgetMin || currentProfile?.preferences?.budgetMin || 6000;
  const budgetMax = currentProfile?.budgetMax || currentProfile?.preferences?.budgetMax || 16000;
  const preferredLocs = currentProfile?.preferredLocations || currentProfile?.preferences?.preferredLocations || [];
  const food = currentProfile?.foodPreference || currentProfile?.preferences?.foodPreference || currentProfile?.preferences?.food || "Vegetarian";
  const sleep = currentProfile?.sleepSchedule || currentProfile?.preferences?.sleepSchedule || "Flexible";
  const cleanliness = currentProfile?.cleanliness || currentProfile?.preferences?.cleanliness || "High";
  const smoking = currentProfile?.smoking ?? currentProfile?.preferences?.smoking;
  const pets = currentProfile?.pets ?? currentProfile?.preferences?.pets;

  return (
    <PageContainer
      title="User Profile & Credentials"
      subtitle="View and manage all your registered account credentials, personal details and living preferences"
    >
      {!isAuthenticated ? (
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm text-center max-w-lg mx-auto">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <User size={28} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Sign in to view your profile</h2>
          <p className="mt-2 text-xs text-slate-500 leading-relaxed">
            Create an account or login to view your personal credentials, manage room listings and match with compatible roommates.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-amber-500 px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      ) : !currentProfile ? (
        <Loader label="Loading your profile credentials..." />
      ) : (
        <div className="space-y-5 sm:space-y-6">
          {/* Top Header Card */}
          <ProfileHeader profile={currentProfile} />

          {/* 1. Account Credentials & Contact Information Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Mail size={16} className="text-amber-500" /> Account & Contact Credentials
              </h2>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-emerald-700 border border-emerald-200">
                Active Account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Email */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Mail size={14} className="text-slate-500" /> Email Address
                </div>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 truncate">{currentProfile.email}</p>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <CheckCircle2 size={11} /> Verified
                </span>
              </div>

              {/* Phone */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Phone size={14} className="text-slate-500" /> Phone Number
                </div>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                  {currentProfile.phone || "Not added"}
                </p>
                <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                  {currentProfile.phone ? "Registered Mobile" : "Click Edit to add"}
                </span>
              </div>

              {/* Account Role */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <User size={14} className="text-slate-500" /> Role / Account Type
                </div>
                <p className="mt-1 text-xs sm:text-sm font-bold text-amber-600">
                  {ROLE_LABELS[currentProfile.role] || currentProfile.role}
                </p>
                <span className="mt-1 text-[10px] font-semibold text-slate-500">
                  ID: #{currentProfile.id || currentProfile._id}
                </span>
              </div>

              {/* Joined */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Calendar size={14} className="text-slate-500" /> Member Since
                </div>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">{formattedJoinedDate}</p>
                <span className="mt-1 text-[10px] font-semibold text-slate-500">RoomDekho Platform</span>
              </div>
            </div>
          </div>

          {/* 2. Personal & Professional Profile Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase size={16} className="text-amber-500" /> Personal & Professional Credentials
              </h2>
              <Link to="/profile/edit" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Gender */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <span className="text-xs font-semibold text-slate-400">Gender</span>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 capitalize">
                  {currentProfile.gender || "Not specified"}
                </p>
              </div>

              {/* Age / DOB */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <span className="text-xs font-semibold text-slate-400">Age</span>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                  {currentProfile.age ? `${currentProfile.age} Years` : currentProfile.dob || "Not specified"}
                </p>
              </div>

              {/* Profession / Occupation */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <span className="text-xs font-semibold text-slate-400">Profession / Occupation</span>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {currentProfile.occupation || (isOwner ? "Property Owner" : "Professional")}
                </p>
              </div>

              {/* Registered City / Location */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <span className="text-xs font-semibold text-slate-400">Primary City / Location</span>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1 truncate">
                  <MapPin size={13} className="text-amber-500 shrink-0" />
                  {currentProfile.city || currentProfile.propertyCity || preferredLocs[0] || "Delhi"}
                </p>
              </div>
            </div>

            {currentProfile.bio && (
              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 sm:p-4">
                <span className="text-xs font-semibold text-slate-400">About Me / Bio</span>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed italic">
                  "{currentProfile.bio}"
                </p>
              </div>
            )}
          </div>

          {/* 3. Living Preferences & Matching Details (Seeker / Roommate) */}
          {isSeeker && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <IndianRupee size={16} className="text-amber-500" /> Living & Budget Matching Preferences
                </h2>
                <Link to="/profile/preferences" className="text-xs font-bold text-amber-600 hover:text-amber-700">
                  Edit Preferences
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Looking For Intent */}
                <div className="rounded-2xl border border-amber-200 bg-amber-500/10 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <Sparkles size={13} /> Looking For
                  </span>
                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    {currentProfile.intent === "find_room" || currentProfile.lookingFor === "find_room" ? (
                      <>
                        <DoorOpen size={16} className="text-amber-600 shrink-0" /> Finding a Room
                      </>
                    ) : currentProfile.intent === "find_roommate" || currentProfile.lookingFor === "find_roommate" ? (
                      <>
                        <Users size={16} className="text-amber-600 shrink-0" /> Finding a Roommate
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} className="text-amber-600 shrink-0" /> Both (Room & Roommate)
                      </>
                    )}
                  </p>
                </div>

                {/* Budget Range */}
                <div className="rounded-2xl border border-amber-100 bg-amber-50/40 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                    <IndianRupee size={13} /> Monthly Budget Range
                  </span>
                  <p className="mt-1.5 text-sm sm:text-base font-extrabold text-slate-900">
                    ₹{Number(budgetMin).toLocaleString()} – ₹{Number(budgetMax).toLocaleString()}
                    <span className="text-xs font-normal text-slate-500"> / mo</span>
                  </p>
                </div>

                {/* Food Preference */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Utensils size={13} className="text-amber-500" /> Dietary / Food Habit
                  </span>
                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 capitalize">{food}</p>
                </div>

                {/* Sleep Routine */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Moon size={13} className="text-amber-500" /> Sleep Routine
                  </span>
                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-slate-900 capitalize">{sleep}</p>
                </div>

                {/* Cleanliness */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400">Cleanliness Standard</span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900 capitalize">
                    {cleanliness || "High"}
                  </p>
                </div>

                {/* Smoking */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400">Smoking Habit</span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                    {smoking ? "Yes (Smoker)" : "No (Non-Smoker)"}
                  </p>
                </div>

                {/* Pets */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400">Pet Friendly</span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                    {pets ? "Yes (Pet Friendly)" : "No Pets"}
                  </p>
                </div>
              </div>

              {preferredLocs.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">Preferred Localities:</span>
                  {preferredLocs.map((loc, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 sm:px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      <MapPin size={11} className="text-amber-500" /> {loc}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Room Owner Property & Verification Credentials (Owner) */}
          {isOwner && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building2 size={16} className="text-amber-500" /> Property & KYC Verification Credentials
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold border ${
                    currentProfile.approval_status === "approved"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  {currentProfile.approval_status === "approved"
                    ? "✓ Verified by Admin"
                    : "⏳ Under Admin Verification"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400">Property City</span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                    {currentProfile.propertyCity || currentProfile.city || "Delhi"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400">Locality / Sector</span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                    {currentProfile.propertyLocality || currentProfile.locality || "Central"}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                  <span className="text-xs font-semibold text-slate-400">ID Proof Document</span>
                  <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                    {currentProfile.idProofType || "Aadhaar Card"}
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 sm:p-4">
                <span className="text-xs font-semibold text-slate-400">Full Property Registered Address</span>
                <p className="mt-1 text-xs sm:text-sm font-bold text-slate-900">
                  {currentProfile.propertyAddress || "Verified on file"}
                </p>
              </div>
            </div>
          )}

          {/* 5. Quick Settings & Navigation Links */}
          <div className="divide-y divide-slate-100 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <Link to="/profile/edit" className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-slate-50 transition-all">
              <span className="rounded-xl bg-amber-50 p-2 sm:p-2.5 text-amber-600">
                <Settings size={17} />
              </span>
              <span className="flex-1">
                <p className="text-xs font-bold text-slate-900">Edit Profile & Contact Details</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">Update full name, phone number, bio, photo, gender and city</p>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>

            {isSeeker && (
              <Link to="/profile/preferences" className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-slate-50 transition-all">
                <span className="rounded-xl bg-blue-50 p-2 sm:p-2.5 text-blue-600">
                  <Sliders size={17} />
                </span>
                <span className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Matching Preferences & Budget</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Change monthly budget, roommate lifestyle habits and locations</p>
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            )}

            {isSeeker && (
              <Link to="/roommates/me" className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-slate-50 transition-all">
                <span className="rounded-xl bg-emerald-50 p-2 sm:p-2.5 text-emerald-600">
                  <Eye size={17} />
                </span>
                <span className="flex-1">
                  <p className="text-xs font-bold text-slate-900">Preview My Roommate Card</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">See how other seekers and roommates see your profile</p>
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            )}

            {isOwner && (
              <Link to="/owner/listings" className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-slate-50 transition-all">
                <span className="rounded-xl bg-indigo-50 p-2 sm:p-2.5 text-indigo-600">
                  <Building2 size={17} />
                </span>
                <span className="flex-1">
                  <p className="text-xs font-bold text-slate-900">My Room Listings</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400">Manage published rooms, add new flats and view visits</p>
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </Link>
            )}

            <Link to="/profile/security" className="flex items-center gap-3 px-4 sm:px-6 py-3.5 sm:py-4 hover:bg-slate-50 transition-all">
              <span className="rounded-xl bg-purple-50 p-2 sm:p-2.5 text-purple-600">
                <ShieldCheck size={17} />
              </span>
              <span className="flex-1">
                <p className="text-xs font-bold text-slate-900">Security & Account Verification</p>
                <p className="text-[10px] sm:text-[11px] text-slate-400">KYC verification status, password management and login activity</p>
              </span>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
