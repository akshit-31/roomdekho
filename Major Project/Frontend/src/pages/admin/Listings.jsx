import { useEffect, useState } from "react";
import ListingModeration from "../../components/admin/ListingModeration";
import Pagination from "../../components/common/Pagination";
import Loader from "../../components/common/Loader";
import { usePagination } from "../../hooks/usePagination";
import { adminApi } from "../../services/api/admin.api";

const STATUS_TABS = [
  { id: "", label: "All Listings" },
  { id: "pending", label: "Pending Approval" },
  { id: "published", label: "Approved / Live" },
  { id: "rejected", label: "Rejected" },
];

export default function Listings() {
  const [result, setResult] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("");
  const { page, totalPages, goTo } = usePagination(result.total, 20);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await adminApi.listings({
        page: p,
        limit: 20,
        status: activeTab || undefined,
      });
      setResult(data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Listing Moderation</h1>
          <p className="text-sm text-gray-500">
            {result.total} listing{result.total === 1 ? "" : "s"} found — unapproved listings are hidden from seekers until approved
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
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
