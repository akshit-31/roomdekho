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
    <PageContainer title="Edit profile" subtitle="Update how you appear to owners and roommates">
      <div className="max-w-lg">
        <ProfileForm initialValues={profile} onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
}
