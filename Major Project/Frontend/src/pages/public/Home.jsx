import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Home as HomeIcon, SlidersHorizontal, Search } from "lucide-react";
import heroRoomBg from "../../assets/images/hero-room.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [locationQuery, setLocationQuery] = useState("Jaipur, Rajasthan");
  const [propertyType, setPropertyType] = useState("All");
  const [category, setCategory] = useState("All");

  const handleSearch = () => {
    navigate(`/rooms?q=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-center bg-slate-50 p-4 sm:p-6 lg:p-10">
      {/* Hero Section Container - Expanded Full Screen Height for Laptop */}
      <section className="relative mx-auto flex min-h-[75vh] w-full max-w-7xl flex-col justify-center overflow-hidden rounded-[3rem] bg-[#1a293e] text-white shadow-2xl">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroRoomBg}
            alt="Interior"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111c2e] via-[#1a293e]/85 to-transparent" />
        </div>

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          className="absolute left-8 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/40 active:scale-95"
          aria-label="Previous slide"
        >
          <ChevronLeft size={26} />
        </button>

        <button
          type="button"
          className="absolute right-8 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-white/40 active:scale-95"
          aria-label="Next slide"
        >
          <ChevronRight size={26} />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-10 pt-16 pb-36 text-center sm:px-20 lg:px-32">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl drop-shadow-md">
            Don't roam around!
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-slate-200 sm:text-xl lg:text-2xl leading-relaxed">
            Find your desired house within 100 hours with 5 easy steps.
          </p>
        </div>

        {/* Floating Pill Search Bar */}
        <div className="absolute bottom-8 left-1/2 z-30 w-[94%] -translate-x-1/2 max-w-5xl rounded-3xl bg-white p-3 shadow-2xl sm:bottom-12">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 items-center">
            {/* Location Input */}
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
              <MapPin size={22} className="text-amber-500 flex-shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Location
                </label>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none"
                  placeholder="Jaipur, Rajasthan"
                />
              </div>
            </div>

            {/* Property Type Select */}
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
              <HomeIcon size={22} className="text-amber-500 flex-shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Property Type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Flat">PG / Shared Flat</option>
                  <option value="Independent">Independent House</option>
                </select>
              </div>
            </div>

            {/* Categories Select */}
            <div className="flex items-center gap-4 px-5 py-3 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
              <SlidersHorizontal size={22} className="text-amber-500 flex-shrink-0" />
              <div className="text-left w-full">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Categories
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-slate-800 focus:outline-none cursor-pointer"
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
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-amber-500 py-4 px-8 text-base font-bold text-white shadow-xl shadow-amber-500/30 hover:bg-amber-600 transition-all active:scale-95"
            >
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
