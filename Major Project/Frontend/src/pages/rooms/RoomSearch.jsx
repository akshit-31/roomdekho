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
import { useAuth } from "../../hooks/useAuth";

export default function RoomSearch() {
  const { isAuthenticated } = useAuth();
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
          {/* Quick Chat Link - Shown ONLY when Authenticated */}
          {isAuthenticated && (
            <Link
              to="/chat"
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95 shrink-0"
            >
              <MessageCircle size={15} />
              <span>Direct Chats</span>
            </Link>
          )}

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
          <div className="flex overflow-hidden rounded-2xl border border-white/15 bg-slate-900/80 backdrop-blur-xl p-1 shadow-xl">
            <button
              type="button"
              onClick={() => setView("posts")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
                view === "posts"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Sparkles size={14} />
              <span>Posts Feed</span>
            </button>
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
                view === "list"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <List size={14} />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition-all ${
                view === "map"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25"
                  : "text-slate-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <Map size={14} />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] w-full">
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
          <div className="space-y-6 w-full min-w-0">
            {gpsActive ? (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 px-4 py-3 text-xs text-emerald-200 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-xs font-black shadow-sm">
                    ✓
                  </span>
                  <div>
                    <span className="font-black text-white">
                      GPS Nearby Search Active {locationName ? `(${locationName})` : ""}:{" "}
                    </span>
                    <span className="text-emerald-300">
                      Rooms closest to you are displayed first (shortest distance to farthest).
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={refreshingGps}
                  onClick={triggerGps}
                  className="rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 px-3.5 py-1.5 text-[11px] font-black text-emerald-200 transition-all cursor-pointer disabled:opacity-60"
                >
                  {refreshingGps ? "↻ Detecting GPS..." : "↻ Refresh Location"}
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 px-4 py-3 text-xs text-amber-200 shadow-xl backdrop-blur-xl">
                <span className="font-semibold">Want to see rooms closest to your live location?</span>
                <button
                  type="button"
                  disabled={refreshingGps}
                  onClick={triggerGps}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-4 py-1.5 text-xs font-black text-white shadow-md transition-all cursor-pointer"
                >
                  {refreshingGps ? "↻ Detecting GPS..." : "📍 Sort by Nearest to Me"}
                </button>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <p className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                <span className="text-amber-400">🔥</span> Showing {items.length} of {total} live room posts
              </p>
              <SortDropdown
                value={filters.sortBy || (gpsActive ? "distance" : "relevance")}
                onChange={(sortBy) => runSearch({ sortBy, sort: sortBy })}
              />
            </div>

            {status === "loading" ? (
              <div className="py-20 text-center">
                <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
                <p className="mt-4 text-xs font-bold text-slate-400">Loading verified social room posts...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-12 text-center text-white shadow-2xl">
                <Building2 size={40} className="mx-auto text-slate-500 mb-3" />
                <h3 className="text-base font-black text-white">No room posts match your criteria</h3>
                <p className="mt-1.5 text-xs text-slate-400">Try modifying your search or reset filters to see all available listings.</p>
                <Button
                  className="mt-5 !bg-amber-500 hover:!bg-amber-600 !text-white text-xs font-black px-6 py-2.5 rounded-2xl shadow-lg"
                  onClick={resetFilters}
                >
                  Reset all filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
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
