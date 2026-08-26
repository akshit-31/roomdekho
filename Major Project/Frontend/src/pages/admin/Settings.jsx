import { useEffect, useState } from "react";
import PlatformSettings from "../../components/admin/PlatformSettings";
import Loader from "../../components/common/Loader";
import { api } from "../../services/api/axios";

export default function Settings() {
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/settings")
      .then(({ data }) => setInitialValues(data.data))
      .catch(() => setInitialValues({}))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading platform settings..." />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Platform settings</h1>
        <p className="text-sm text-gray-500">Global configuration for the platform</p>
      </div>

      <div className="max-w-lg">
        <PlatformSettings initialValues={initialValues} />
      </div>
    </div>
  );
}
