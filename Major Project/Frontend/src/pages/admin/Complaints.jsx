import { useEffect, useState } from "react";
import ComplaintList from "../../components/admin/ComplaintList";
import Loader from "../../components/common/Loader";
import { api } from "../../services/api/axios";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/complaints")
      .then(({ data }) => setComplaints(data.data || []))
      .catch(() => setComplaints([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Complaints</h1>
        <p className="text-sm text-gray-500">Support tickets raised by users</p>
      </div>

      {loading ? <Loader /> : <ComplaintList complaints={complaints} />}
    </div>
  );
}
