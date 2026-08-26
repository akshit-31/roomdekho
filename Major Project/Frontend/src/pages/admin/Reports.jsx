import { useEffect, useState } from "react";
import ReportTable from "../../components/admin/ReportTable";
import Modal from "../../components/common/Modal";
import Loader from "../../components/common/Loader";
import { adminApi } from "../../services/api/admin.api";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    adminApi.reports()
      .then(({ data }) => setReports(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
        <p className="text-sm text-gray-500">User-submitted reports on listings, users, and reviews</p>
      </div>

      {loading ? <Loader /> : <ReportTable reports={reports} onInvestigate={setSelected} />}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Report details">
        {selected && (
          <div className="space-y-2 text-sm text-gray-700">
            <p><span className="font-medium">Type:</span> {selected.targetType}</p>
            <p><span className="font-medium">Reported by:</span> {selected.reportedBy?.name}</p>
            <p><span className="font-medium">Reason:</span> {selected.reason}</p>
            {selected.details && <p><span className="font-medium">Details:</span> {selected.details}</p>}
          </div>
        )}
      </Modal>
    </div>
  );
}
