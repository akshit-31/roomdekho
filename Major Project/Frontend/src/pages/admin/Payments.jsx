import { useEffect, useState } from "react";
import PaymentTable from "../../components/admin/PaymentTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import { usePagination } from "../../hooks/usePagination";
import { api } from "../../services/api/axios";

export default function Payments() {
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { page, totalPages, goTo } = usePagination(result.total, 20);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/payments", { params: { page: p, limit: 20 } });
      setResult(data.data || { items: [], total: 0 });
    } catch {
      setResult({ items: [], total: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Payments</h1>
        <p className="text-sm text-gray-500">Platform-wide transaction log</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <PaymentTable payments={result.items} />
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination page={page} totalPages={totalPages} onChange={(p) => { goTo(p); load(p); }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
