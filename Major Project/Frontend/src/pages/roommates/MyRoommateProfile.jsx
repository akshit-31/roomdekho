import { Link } from "react-router-dom";
import { Eye, Settings } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import RoommateProfile from "../../components/roommate/RoommateProfile";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { useUser } from "../../hooks/useUser";

/**
 * Shows the current user how their own roommate profile appears to
 * others (reuses RoommateProfile in "preview" mode — no match/ConnectButton
 * since you can't match with yourself).
 */
export default function MyRoommateProfile() {
  const { profile, status } = useUser();

  if (status === "loading" || !profile) return <Loader label="Loading your profile..." />;

  return (
    <PageContainer
      title="My roommate profile"
      subtitle="This is what compatible roommates see when they view your profile"
      action={
        <Link to="/profile/preferences">
          <Button variant="secondary" icon={Settings}>Edit preferences</Button>
        </Link>
      }
    >
      <div className="mb-4 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
        <Eye size={16} /> Preview mode — this is how other users see your profile.
      </div>
      <RoommateProfile roommate={profile} />
    </PageContainer>
  );
}
