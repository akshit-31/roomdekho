import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import ProfileForm from "../../components/profile/ProfileForm";
import Loader from "../../components/common/Loader";
import { useUser } from "../../hooks/useUser";

export default function EditProfile() {
  const { profile, status, update } = useUser();
  const navigate = useNavigate();

  if (status === "loading" || !profile) return <Loader label="Loading your profile..." />;

  const handleSubmit = async (data) => {
    await update(data);
    navigate("/profile");
  };

  return (
    <PageContainer title="Edit Profile & Credentials" subtitle="Update your personal details, location and contact credentials">
      <div className="max-w-xl">
        <ProfileForm initialValues={profile} onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
}
