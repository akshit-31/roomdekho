import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import OwnerStats from "../../components/owner/OwnerStats";
import EnquiryList from "../../components/owner/EnquiryList";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { ownerApi } from "../../services/api/owner.api";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({});
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [{ data: dashRes }, { data: enqRes }] = await Promise.all([
          ownerApi.dashboard(),
          ownerApi.enquiries(),
        ]);
        setStats(dashRes.data || {});
        setEnquiries((enqRes.data || []).slice(0, 5));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loader label="Loading your dashboard..." />;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Owner dashboard</h1>
          <p className="text-sm text-gray-500">A snapshot of your listings and activity</p>
        </div>
        <Link to="/owner/listings/new">
          <Button icon={Plus}>Add listing</Button>
        </Link>
      </div>

      <OwnerStats stats={stats} />

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Recent enquiries</h2>
          <Link to="/owner/enquiries" className="text-xs font-medium text-brand-600 hover:underline">View all</Link>
        </div>
        <EnquiryList enquiries={enquiries} />
      </div>
    </div>
  );
}
