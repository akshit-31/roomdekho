import PropertyGrid from "../property/PropertyGrid";
import Pagination from "../common/Pagination";
import SortDropdown from "./SortDropdown";
import { usePagination } from "../../hooks/usePagination";

export default function SearchResults({ results, status, sortBy, onSortChange, onPageChange }) {
  const { items = [], total = 0, page = 1, limit = 20 } = results || {};
  const { totalPages } = usePagination(total, limit);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {total} {total === 1 ? "room" : "rooms"} found
        </p>
        <SortDropdown value={sortBy} onChange={onSortChange} />
      </div>

      <PropertyGrid rooms={items} loading={status === "loading"} />

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
