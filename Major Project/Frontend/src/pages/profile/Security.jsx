import { useState } from "react";
import { useForm } from "react-hook-form";
import { ShieldCheck } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import VerificationStatus from "../../components/profile/VerificationStatus";
import LoginActivity from "../../components/profile/LoginActivity";
import DocumentUpload from "../../components/documentation/DocumentUpload";
import Select from "../../components/common/Select";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import ErrorMessage from "../../components/common/ErrorMessage";
import Loader from "../../components/common/Loader";
import { useUser } from "../../hooks/useUser";
import { authApi } from "../../services/api/auth.api";
import { getErrorMessage } from "../../utils/errorHandler";

const ID_TYPES = [
  { value: "aadhaar", label: "Aadhaar" },
  { value: "pan", label: "PAN" },
  { value: "passport", label: "Passport" },
  { value: "driving_license", label: "Driving License" },
];

function KycForm({ onSubmitted }) {
  const [idDocumentUrl, setIdDocumentUrl] = useState(null);
  const [selfieUrl, setSelfieUrl] = useState(null);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues: { idType: "aadhaar", idNumber: "" } });

  const submit = async (data) => {
    if (!idDocumentUrl || !selfieUrl) {
      setError("Please upload both your ID document and a selfie before submitting.");
      return;
    }
    setError(null);
    try {
      await authApi.submitKyc({ ...data, idDocumentUrl, selfieUrl });
      onSubmitted?.();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <ShieldCheck size={16} className="text-brand-500" /> Complete KYC verification
      </h2>
      {error && <ErrorMessage message={error} />}

      <div className="grid grid-cols-2 gap-4">
        <Select label="ID type" options={ID_TYPES} {...register("idType", { required: true })} />
        <Input label="ID number" {...register("idNumber", { required: "ID number is required" })} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">ID document</p>
          <DocumentUpload label="Upload ID document" onUploaded={(doc) => setIdDocumentUrl(doc.url)} />
          {idDocumentUrl && <p className="mt-1 text-xs text-green-600">Uploaded ✓</p>}
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium text-gray-700">Selfie</p>
          <DocumentUpload label="Upload a selfie" accept="image/*" onUploaded={(doc) => setSelfieUrl(doc.url)} />
          {selfieUrl && <p className="mt-1 text-xs text-green-600">Uploaded ✓</p>}
        </div>
      </div>

      <Button type="submit" loading={isSubmitting}>Submit for verification</Button>
    </form>
  );
}

export default function Security() {
  const { profile, status, update: refetch } = useUser();
  const [submitted, setSubmitted] = useState(false);

  if (status === "loading" || !profile) return <Loader label="Loading security settings..." />;

  const needsKyc = ["not_submitted", "rejected"].includes(profile.kyc?.status) && !submitted;

  return (
    <PageContainer title="Security & verification" subtitle="Keep your account safe and verified">
      <div className="max-w-lg space-y-5">
        <VerificationStatus profile={profile} />

        {needsKyc && <KycForm onSubmitted={() => setSubmitted(true)} />}
        {submitted && (
          <div className="rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
            KYC submitted — we'll review it and update your status soon.
          </div>
        )}

        <LoginActivity />
      </div>
    </PageContainer>
  );
}
