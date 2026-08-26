import { useEffect, useState } from "react";
import EnquiryList from "../../components/owner/EnquiryList";
import Loader from "../../components/common/Loader";
import { ownerApi } from "../../services/api/owner.api";

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ownerApi.enquiries()
      .then(({ data }) => setEnquiries(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Enquiries</h1>
        <p className="text-sm text-gray-500">People who've messaged you about a listing</p>
      </div>

      {loading ? <Loader /> : <EnquiryList enquiries={enquiries} />}
    </div>
  );
}
