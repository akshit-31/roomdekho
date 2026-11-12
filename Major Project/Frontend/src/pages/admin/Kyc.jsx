import { useEffect, useState } from "react";
import KycVerification from "../../components/admin/KycVerification";
import Loader from "../../components/common/Loader";
import { adminApi } from "../../services/api/admin.api";

export default function Kyc() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await adminApi.kycQueue();
      setSubmissions(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Room Owner Approvals & KYC</h1>
        <p className="text-sm text-gray-500">
          Verify registered room owners, inspect property location details, and approve accounts before they can log in.
        </p>
      </div>

      {loading ? <Loader /> : <KycVerification submissions={submissions} onChanged={load} />}
    </div>
  );
}
