import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Home as HomeIcon, SlidersHorizontal, Search } from "lucide-react";
import heroRoomBg from "../../assets/images/hero-room.jpg";
import PropertyGrid from "../../components/property/PropertyGrid";
import { searchApi } from "../../services/api/search.api";
import { useEffect } from "react";

const DEMO_ROOMS = [
  {
    _id: "demo-room-1",
    title: "Modern room near Metro",
    rent: 8500,
    isVerified: true,
    address: { locality: "Sector 62", city: "Noida" },
    occupancy: { genderPreference: "any" },
  },
  {
    _id: "demo-room-2",
    title: "Furnished room in a quiet area",
    rent: 9500,
    isVerified: true,
    address: { locality: "Laxmi Nagar", city: "Delhi" },
    occupancy: { genderPreference: "any" },
  },
  {
    _id: "demo-room-3",
    title: "Bright room for working professionals",
    rent: 7800,
    isVerified: true,
    address: { locality: "Vaishali", city: "Ghaziabad" },
    occupancy: { genderPreference: "male" },
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState("Jaipur, Rajasthan");
  const [propertyType, setPropertyType] = useState("All");
  const [category, setCategory] = useState("All");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await searchApi.searchRooms({ limit: 6 });
        setRooms(data?.data?.items?.length ? data.data.items : DEMO_ROOMS);
      } catch {
        setRooms(DEMO_ROOMS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSearch = () => {
    navigate(`/rooms?q=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-8 lg:px-12">
      {/* Hero Section Container */}
      <section className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#1e2d42] text-white shadow-2xl">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroRoomBg}
            alt="Interior"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#172336] via-[#1e2d42]/90 to-transparent" />
        </div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          className="absolute left-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"
          aria-label="Previous slide"
        >
          <ChevronLeft size={22} />
        </button>

        <button
          type="button"
          className="absolute right-6 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/40"
          aria-label="Next slide"
        >
          <ChevronRight size={22} />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-20 pb-32 text-center sm:px-16 lg:px-24">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            Don't roam around!
          </h1>
          <p className="mt-4 max-w-xl text-base font-normal text-slate-300 sm:text-lg">
            Find your desired house within 100 hours with 5 easy steps.
          </p>
        </div>

        {/* Floating Pill Search Bar */}
        <div className="absolute bottom-6 left-1/2 z-30 w-[92%] -translate-x-1/2 max-w-4xl rounded-2xl bg-white p-2.5 shadow-2xl sm:bottom-8">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 items-center">
            {/* Location Input */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all">
              <MapPin size={18} className="text-amber-500 flex-shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Location
                </label>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                  placeholder="Jaipur, Rajasthan"
                />
              </div>
            </div>

            {/* Property Type Select */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all">
              <HomeIcon size={18} className="text-amber-500 flex-shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Flat">PG / Shared Flat</option>
                  <option value="Independent">Independent House</option>
                </select>
              </div>
            </div>

            {/* Categories Select */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-transparent hover:border-slate-200 transition-all">
              <SlidersHorizontal size={18} className="text-amber-500 flex-shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Categories
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>

            {/* Search Action Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all active:scale-95"
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="mx-auto max-w-7xl pt-16 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Properties</h2>
            <p className="text-xs text-slate-500 mt-1">Explore top choices tailored for your comfort.</p>
          </div>
          <button
            onClick={() => navigate("/rooms")}
            className="text-xs font-bold text-amber-600 hover:underline"
          >
            View All →
          </button>
        </div>

        <PropertyGrid rooms={rooms} loading={loading} />
      </section>
    </div>
  );
}
