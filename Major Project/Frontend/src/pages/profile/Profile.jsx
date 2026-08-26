import { Link } from "react-router-dom";
import { Settings, Sliders, Lock, ShieldCheck, ChevronRight } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import ProfileHeader from "../../components/profile/ProfileHeader";
import VerificationStatus from "../../components/profile/VerificationStatus";
import Loader from "../../components/common/Loader";
import { useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";

const LINKS = [
  { to: "/profile/edit", label: "Edit profile", desc: "Name, bio, photo, gender", icon: Settings },
  { to: "/profile/preferences", label: "Matching preferences", desc: "Budget, lifestyle, roommate matching", icon: Sliders },
  { to: "/profile/privacy", label: "Privacy", desc: "Who can see your profile and contact info", icon: Lock },
  { to: "/profile/security", label: "Security & verification", desc: "KYC, password, login activity", icon: ShieldCheck },
];

export default function Profile() {
  const { profile, status } = useUser();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <PageContainer title="My Profile" subtitle="Your profile and roommate preferences">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-brand-600">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Your profile is ready to set up</h2>
              <p className="mt-1 text-sm text-gray-500">
                Create an account to save preferences, manage your profile, and connect with roommates.
              </p>
            </div>
          </div>
          <div className="mt-5 flex gap-3">
            <Link to="/login" className="signup-button">Log in</Link>
            <Link to="/register" className="dashboard-button">Create account</Link>
          </div>
        </div>
      </PageContainer>
    );
  }

  const { user } = useAuth();
  const currentProfile = profile || user;

  if (!currentProfile) return <Loader label="Loading your profile..." />;

  return (
    <PageContainer title="Profile">
      <div className="space-y-5">
        <ProfileHeader profile={currentProfile} />
        <VerificationStatus profile={currentProfile} />

        <div className="divide-y divide-gray-50 overflow-hidden rounded-2xl border border-gray-100 bg-white">
          {LINKS.map(({ to, label, desc, icon: Icon }) => (
            <Link key={to} to={to} className="flex items-center gap-3 px-5 py-4 hover:bg-gray-50">
              <span className="rounded-xl bg-brand-50 p-2 text-brand-600"><Icon size={18} /></span>
              <span className="flex-1">
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{desc}</p>
              </span>
              <ChevronRight size={16} className="text-gray-300" />
            </Link>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
