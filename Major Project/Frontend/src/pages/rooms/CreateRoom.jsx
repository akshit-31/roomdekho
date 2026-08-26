import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import PropertyForm from "../../components/property/PropertyForm";
import { propertyApi } from "../../services/api/property.api";

export default function CreateRoom() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    const { data: res } = await propertyApi.create(data);
    // New listings start as drafts — send the owner straight to media
    // upload / publish on the edit page.
    navigate(`/owner/listings/${res.data._id}/edit`, { state: { justCreated: true } });
  };

  return (
    <PageContainer title="Add a new listing" subtitle="Fill in the details — you can publish once photos are uploaded">
      <div className="max-w-2xl">
        <PropertyForm onSubmit={handleSubmit} submitLabel="Create listing" />
      </div>
    </PageContainer>
  );
}
