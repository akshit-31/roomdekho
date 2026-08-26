import { useEffect, useState } from "react";
import UserTable from "../../components/admin/UserTable";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import Input from "../../components/common/Input";
import { usePagination } from "../../hooks/usePagination";
import { adminApi } from "../../services/api/admin.api";
import { useDebounce } from "../../hooks/useDebounce";

const ROLE_TABS = [
  { id: "", label: "All Users" },
  { id: "owner", label: "Room Owners" },
  { id: "roommate", label: "Roommates" },
  { id: "seeker", label: "Room Finders" },
  { id: "admin", label: "Admins" },
];

export default function Users() {
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const { page, totalPages, goTo } = usePagination(result.total, 20);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminApi.users({
        page: p,
        limit: 20,
        search: debouncedSearch || undefined,
        role: activeTab || undefined,
      });
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [debouncedSearch, activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500">{result.total} users found in this category</p>
        </div>
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>

      {/* Role Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
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
