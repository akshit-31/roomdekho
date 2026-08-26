import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import PropertyForm from "../../components/property/PropertyForm";
import PropertyGallery from "../../components/property/PropertyGallery";
import ListingActions from "../../components/owner/ListingActions";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { propertyApi } from "../../services/api/property.api";

export default function EditRoom() {
  const { id } = useParams();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const load = async () => {
    setLoading(true);
    const { data } = await propertyApi.getOne(id);
    setRoom(data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async (data) => {
    await propertyApi.update(id, data);
    await load();
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      Array.from(files).forEach((f) => formData.append("files", f));
      await propertyApi.uploadMedia(id, formData);
      await load();
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader label="Loading listing..." />;
  if (!room) return null;

  return (
    <PageContainer
      title="Edit listing"
      subtitle={room.title}
      action={<ListingActions room={room} onChanged={load} />}
    >
      {location.state?.justCreated && (
        <div className="mb-6 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Listing created as a draft. Upload photos and publish it below to make it visible to seekers.
        </div>
      )}

      <div className="mb-8 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Photos &amp; videos</h2>
        <PropertyGallery media={room.media} />
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />
        <Button variant="secondary" icon={UploadCloud} loading={uploading} onClick={() => fileRef.current?.click()}>
          Upload photos/videos
        </Button>
      </div>

      <div className="max-w-2xl">
        <PropertyForm initialValues={room} onSubmit={handleSave} submitLabel="Save changes" />
      </div>
    </PageContainer>
  );
}
