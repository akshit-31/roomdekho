import { useNavigate } from "react-router-dom";
import PageContainer from "../../components/layout/PageContainer";
import PropertyForm from "../../components/property/PropertyForm";
import { propertyApi } from "../../services/api/property.api";

export default function CreateRoom() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        city: formData.address?.city || formData.city || "Noida",
        locality: formData.address?.locality || formData.locality || "",
        address: formData.address?.line1 || formData.address || "",
        rent: Number(formData.rent),
        deposit: Number(formData.securityDeposit || 0),
        propertyType: formData.propertyType || "apartment",
        roomType: formData.sharingType || formData.roomType || "private",
        furnishing: formData.furnishing || "furnished",
        genderPreference: formData.occupancy?.genderPreference || "any",
        availableFrom: formData.moveInDate || new Date().toISOString(),
        amenities: formData.amenities || [],
        images: formData.images || [],
      };

      const { data: res } = await propertyApi.create(payload);
      const createdId = res?.data?.id || res?.data?._id;
      navigate("/owner/listings", { state: { justCreated: true } });
    } catch (err) {
      console.error("Listing creation failed:", err);
      alert(err?.response?.data?.message || "Failed to create listing. Please check all fields.");
    }
  };

  return (
    <PageContainer title="Add a new listing" subtitle="Fill in the details — you can publish once photos are uploaded">
      <div className="max-w-2xl">
        <PropertyForm onSubmit={handleSubmit} submitLabel="Create listing" />
      </div>
    </PageContainer>
  );
}
