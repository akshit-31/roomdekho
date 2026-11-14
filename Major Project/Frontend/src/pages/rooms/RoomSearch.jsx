import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Map, List, SlidersHorizontal, Sparkles, MessageCircle, Building2 } from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import SearchBar from "../../components/search/SearchBar";
import SearchFilters from "../../components/search/SearchFilters";
import SearchResults from "../../components/search/SearchResults";
import SearchMap from "../../components/search/SearchMap";
import SortDropdown from "../../components/search/SortDropdown";
import Pagination from "../../components/common/Pagination";
import RoomPostCard from "../../components/property/RoomPostCard";
import Modal from "../../components/common/Modal";
import Button from "../../components/common/Button";
import { useSearch } from "../../hooks/useSearch";
import { usePagination } from "../../hooks/usePagination";

export default function RoomSearch() {
  const [params, setParams] = useSearchParams();
  const { filters, results, status, search, setFilters, resetFilters } = useSearch();
  const [view, setView] = useState("posts"); // posts | list | map
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [refreshingGps, setRefreshingGps] = useState(false);
  const [locationName, setLocationName] = useState("");

  const items = results?.items || [];
  const total = results?.pagination?.total ?? results?.total ?? items.length;
  const page = results?.pagination?.page ?? results?.page ?? 1;
  const limit = results?.pagination?.limit ?? results?.limit ?? 20;
  const { totalPages } = usePagination(total, limit);

  // Seed filters from the URL once on mount, and auto-detect GPS for nearest rooms first
  useEffect(() => {
    const initial = Object.fromEntries(params.entries());
    let cached = null;
    try {
      cached = JSON.parse(localStorage.getItem("user_gps") || "null");
    } catch {}

    const applyLocation = (coords) => {
      setGpsActive(true);
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
        .then((r) => r.json())
        .then((geo) => {
          const c = geo.address?.city || geo.address?.state_district || geo.address?.town || geo.address?.suburb || "";
          if (c) setLocationName(c);
        })
        .catch(() => {});
    };

    if (cached?.lat && cached?.lng) {
      applyLocation(cached);
      const combined = { lat: cached.lat, lng: cached.lng, sort: "distance", sortBy: "distance", ...initial };
      setFilters(combined);
      search(combined);
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          localStorage.setItem("user_gps", JSON.stringify(coords));
          applyLocation(coords);
          const combined = { lat: coords.lat, lng: coords.lng, sort: "distance", sortBy: "distance", ...initial };
          setFilters(combined);
          search(combined);
        },
        () => {
          setFilters(initial);
          search(initial);
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else {
      setFilters(initial);
      search(initial);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const triggerGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setRefreshingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        localStorage.setItem("user_gps", JSON.stringify(coords));
        setGpsActive(true);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`);
          const geo = await res.json();
          const c = geo.address?.city || geo.address?.state_district || geo.address?.town || geo.address?.suburb || "";
          if (c) setLocationName(c);
        } catch {}

        setRefreshingGps(false);
        runSearch({ lat: coords.lat, lng: coords.lng, sort: "distance", sortBy: "distance" });
      },
      (err) => {
        setRefreshingGps(false);
        alert("Location permission was denied. Please allow location in your browser settings.");
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const runSearch = (patch = {}) => {
    const next = { ...filters, ...patch, page: 1 };
    Object.keys(next).forEach((k) => {
      if (next[k] === "" || next[k] === undefined || next[k] === null) {
        delete next[k];
      }
    });
    setFilters(next);
    setParams(next);
    search(next);
  };

  const handleResetFilters = () => {
    resetFilters();
    setParams({});
    search({ sort: "distance", sortBy: "distance" });
  };

  const handlePageChange = (newPage) => {
    const next = { ...filters, page: newPage };
    setFilters(next);
    search(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <PageContainer
      title="Verified Rooms & Community Feed"
      subtitle="Explore real room posts, direct host contacts, and instant messaging"
    >
      {/* Top Search & View Action Bar */}
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 max-w-xl">
          <SearchBar initialQuery={filters.q} onSearch={(q) => runSearch({ q })} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Chat Link */}
          <Link
            to="/chat"
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95 shrink-0"
          >
            <MessageCircle size={15} />
            <span>Direct Chats</span>
          </Link>

          {/* Mobile Filter Button */}
          <Button
            variant="secondary"
            icon={SlidersHorizontal}
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden text-xs py-2"
          >
            Filters
          </Button>

          {/* 3-Way View Switcher */}
          <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-slate-50 p-0.5">
            <button
              type="button"
              onClick={() => setView("posts")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                view === "posts"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Sparkles size={14} />
              <span>Posts Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                view === "list"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <List size={14} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                view === "map"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
              }`}
            >
              <Map size={14} />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        {/* Desktop Sidebar Filters */}
        <div className="hidden lg:block">
          <SearchFilters
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
            onApply={(f) => runSearch(f || filters)}
          />
        </div>

        {/* Content Area Based on Active View */}
        {view === "posts" ? (
          <div className="space-y-4">
            {gpsActive ? (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                    ✓
                  </span>
                  <div>
                    <span className="font-bold text-emerald-950">
                      GPS Nearby Search Active {locationName ? `(${locationName})` : ""}:{" "}
                    </span>
                    <span className="text-emerald-800">
                      Rooms closest to you are displayed first (shortest distance to farthest).
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={refreshingGps}
                  onClick={triggerGps}
                  className="rounded-lg bg-emerald-100 hover:bg-emerald-200 px-3 py-1 text-[11px] font-bold text-emerald-900 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {refreshingGps ? "↻ Detecting GPS..." : "↻ Refresh Location"}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-amber-50 border border-amber-200 px-4 py-2 text-xs text-amber-800">
                <span>Want to see rooms closest to your live location?</span>
                <button
                  type="button"
                  disabled={refreshingGps}
                  onClick={triggerGps}
                  className="rounded-lg bg-amber-500 hover:bg-amber-600 px-3 py-1 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                >
                  {refreshingGps ? "↻ Detecting GPS..." : "📍 Sort by Nearest to Me"}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-gray-200/80 pb-3">
              <p className="text-xs sm:text-sm font-bold text-slate-800">
                🔥 Showing {items.length} of {total} live room posts
              </p>
              <SortDropdown
                value={filters.sortBy || (gpsActive ? "distance" : "relevance")}
                onChange={(sortBy) => runSearch({ sortBy, sort: sortBy })}
              />
            </div>

            {status === "loading" ? (
              <div className="py-16 text-center">
                <div className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                <p className="mt-3 text-xs font-bold text-slate-600">Loading verified social room posts...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
                <Building2 size={36} className="mx-auto text-slate-400 mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No room posts match your criteria</h3>
                <p className="mt-1 text-xs text-slate-500">Try modifying your search or reset filters to see all available listings.</p>
                <Button
                  variant="secondary"
                  className="mt-4 text-xs font-bold"
                  onClick={resetFilters}
                >
                  Reset all filters
                </Button>
              </div>
            ) : (
              <div className="space-y-6 max-w-2xl mx-auto">
                {items.map((room) => (
                  <RoomPostCard key={room._id || room.id} room={room} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center pb-8">
                <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
              </div>
            )}
          </div>
        ) : view === "list" ? (
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
              rooms={items}
              center={filters.lat ? { lat: Number(filters.lat), lng: Number(filters.lng) } : undefined}
              radiusKm={Number(filters.radiusKm) || 0}
            />
          </div>
        )}
      </div>

      {/* Mobile Filters Modal */}
      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters" size="sm">
        <SearchFilters
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          onApply={(f) => {
            runSearch(f || filters);
            setFiltersOpen(false);
          }}
        />
      </Modal>
    </PageContainer>
  );
}
