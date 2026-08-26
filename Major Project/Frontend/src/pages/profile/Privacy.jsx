import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import PrivacySettings from "../../components/profile/PrivacySettings";
import Loader from "../../components/common/Loader";
import { useUser } from "../../hooks/useUser";

export default function Privacy() {
  const { profile, status, update } = useUser();
  const navigate = useNavigate();

  if (status === "loading" || !profile) return <Loader label="Loading your privacy settings..." />;

  const handleSubmit = async (privacy) => {
    await update({ privacy });
    navigate("/profile");
  };

  return (
    <PageContainer title="Privacy" subtitle="Control what others can see about you">
      <div className="max-w-lg">
        <PrivacySettings initialValues={profile.privacy} onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
}
