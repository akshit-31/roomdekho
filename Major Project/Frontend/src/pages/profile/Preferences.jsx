import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import ProfilePreferences from "../../components/profile/ProfilePreferences";
import Loader from "../../components/common/Loader";
import { useUser } from "../../hooks/useUser";

export default function Preferences() {
  const { profile, status, update } = useUser();
  const navigate = useNavigate();

  if (status === "loading" || !profile) return <Loader label="Loading your preferences..." />;

  const handleSubmit = async (preferences) => {
    await update({ preferences });
    navigate("/profile");
  };

  return (
    <PageContainer title="Matching preferences" subtitle="This powers your AI roommate compatibility score">
      <div className="max-w-lg">
        <ProfilePreferences initialValues={profile.preferences} onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
}
