import { useEffect, useState } from "react";
import ListingModeration from "../../components/admin/ListingModeration";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import { usePagination } from "../../hooks/usePagination";
import { adminApi } from "../../services/api/admin.api";

export default function Listings() {
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { page, totalPages, goTo } = usePagination(result.total, 20);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminApi.listings({ page: p, limit: 20 });
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Listing moderation</h1>
        <p className="text-sm text-gray-500">Review flagged and newly published listings</p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <ListingModeration listings={result.items} onChanged={() => load(page)} />
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
