import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, MapPin, Home as HomeIcon, SlidersHorizontal, Search } from "lucide-react";

import img1 from "../../image.png";
import img2 from "../../image copy.png";
import img3 from "../../image copy 2.png";
import img4 from "../../ef0c218f-6a1e-4f6d-b14f-a210f8c46a77.jfif";

const SLIDE_IMAGES = [img1, img2, img3, img4];

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [locationQuery, setLocationQuery] = useState("Jaipur, Rajasthan");
  const [propertyType, setPropertyType] = useState("All");
  const [category, setCategory] = useState("All");

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    navigate(`/rooms?q=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-5rem)] flex-col justify-center bg-slate-50 p-2 sm:p-4 lg:p-6">
      {/* Hero Section Container - Expanded Full Screen Height & Full Width Fit */}
      <section className="relative mx-auto flex min-h-[82vh] w-full max-w-[96vw] flex-col justify-center overflow-hidden rounded-[2.5rem] bg-[#1a293e] text-white shadow-2xl">
        {/* Background Image Carousel */}
        {SLIDE_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-45 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}

        {/* Gradient Overlay for Text Legibility */}
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/50 to-[#0f172a]/40" />

        {/* Carousel Arrow Controls */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-6 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-slate-900/70 active:scale-95 border border-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-6 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-slate-900/70 active:scale-95 border border-white/20"
          aria-label="Next slide"
        >
          <ChevronRight size={28} />
        </button>

        {/* Slide Indicators Dots */}
        <div className="absolute top-6 right-8 z-20 flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 backdrop-blur-md border border-white/10">
          {SLIDE_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentSlide ? "w-7 bg-amber-500" : "w-2.5 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-12 pb-36 text-center sm:px-16 lg:px-28">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl drop-shadow-lg">
            Don't roam around!
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-medium text-slate-200 sm:text-xl lg:text-2xl leading-relaxed drop-shadow-md">
            Find your desired house within 100 hours with 5 easy steps.
          </p>
        </div>

        {/* Floating Pill Search Bar */}
        <div className="absolute bottom-8 left-1/2 z-30 w-[94%] -translate-x-1/2 max-w-5xl rounded-3xl bg-white p-3 shadow-2xl sm:bottom-10">
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
