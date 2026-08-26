import { useEffect, useState } from "react";
import UserTable from "../../components/admin/UserTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import Input from "../../components/common/Input";
import { usePagination } from "../../hooks/usePagination";
import { adminApi } from "../../services/api/admin.api";
import { useDebounce } from "../../hooks/useDebounce";

export default function Users() {
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const { page, totalPages, goTo } = usePagination(result.total, 20);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminApi.users({ page: p, limit: 20, search: debouncedSearch || undefined });
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(1); }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">{result.total} total users</p>
        </div>
        <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <>
          <UserTable users={result.items} onChanged={() => load(page)} />
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
