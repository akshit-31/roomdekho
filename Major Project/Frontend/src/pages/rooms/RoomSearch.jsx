import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Map, List, SlidersHorizontal } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/search/SearchBar";
import SearchFilters from "../../components/search/SearchFilters";
import SearchResults from "../../components/search/SearchResults";
import SearchMap from "../../components/search/SearchMap";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { useSearch } from "../../hooks/useSearch";

export default function RoomSearch() {
  const [params, setParams] = useSearchParams();
  const { filters, results, status, search, setFilters, resetFilters } = useSearch();
  const [view, setView] = useState("list"); // list | map
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Seed filters from the URL once on mount (e.g. /rooms?q=...&city=...)
  useEffect(() => {
    const initial = Object.fromEntries(params.entries());
    if (Object.keys(initial).length) {
      setFilters(initial);
      search(initial);
    } else {
      search({});
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runSearch = (patch = {}) => {
    const next = { ...filters, ...patch, page: 1 };
    setFilters(next);
    setParams(next);
    search(next);
  };

  const handlePageChange = (page) => {
    const next = { ...filters, page };
    setFilters(next);
    search(next);
  };

  return (
    <PageContainer title="Find a room" subtitle="Search verified rooms, PGs, flats and hostels near you">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar initialQuery={filters.q} onSearch={(q) => runSearch({ q })} />
        <div className="flex gap-2">
          <Button variant="secondary" icon={SlidersHorizontal} onClick={() => setFiltersOpen(true)} className="lg:hidden">
            Filters
          </Button>
          <div className="flex overflow-hidden rounded-xl border border-gray-200">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm ${view === "list" ? "bg-brand-500 text-white" : "text-gray-600"}`}
            >
              <List size={15} /> List
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm ${view === "map" ? "bg-brand-500 text-white" : "text-gray-600"}`}
            >
              <Map size={15} /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <SearchFilters filters={filters} onChange={setFilters} onReset={resetFilters} onApply={() => runSearch()} />
        </div>

        {view === "list" ? (
          <SearchResults
            results={results}
            status={status}
            sortBy={filters.sortBy || "relevance"}
            onSortChange={(sortBy) => runSearch({ sortBy })}
            onPageChange={handlePageChange}
          />
        ) : (
          <div className="h-[70vh] overflow-hidden rounded-2xl border border-gray-100">
            <SearchMap
              rooms={results.items}
              center={filters.lat ? { lat: Number(filters.lat), lng: Number(filters.lng) } : undefined}
              radiusKm={Number(filters.radiusKm) || 0}
            />
          </div>
        )}
      </div>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" size="sm">
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onReset={resetFilters}
          onApply={() => { runSearch(); setFiltersOpen(false); }}
        />
      </Modal>
    </PageContainer>
  );
}
