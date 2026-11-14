import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, MapPin, Building2, ShieldCheck, Zap, HeartHandshake, ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import AuthModal from "../../components/auth/AuthModal";
import { useAuth } from "../../hooks/useAuth";
import VendorDashboard from "../vendor/VendorDashboard";
import { searchApi } from "../../services/api/search.api";
import RoomPostCard from "../../components/property/RoomPostCard";

import img1 from "../../image.png";
import img2 from "../../image copy.png";
import img3 from "../../image copy.png";
import img4 from "../../ef0c218f-6a1e-4f6d-b14f-a210f8c46a77.jfif";

const SLIDE_IMAGES = [img1, img2, img3, img4];

const POPULAR_CITIES = [
  { name: "Delhi", count: "120+ Listings", image: img1 },
  { name: "Noida", count: "85+ Listings", image: img2 },
  { name: "Gurgaon", count: "150+ Listings", image: img3 },
  { name: "Bengaluru", count: "200+ Listings", image: img4 },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Verified Owners",
    desc: "Direct contact with real room owners. Zero fake brokers.",
  },
  {
    icon: Zap,
    title: "Fast 5-Step Booking",
    desc: "Search, filter by city, chat directly, visit, and move in.",
  },
  {
    icon: HeartHandshake,
    title: "AI Roommate Match",
    desc: "Find compatible roommates sharing similar preferences.",
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Delhi");
  const [selectedType, setSelectedType] = useState("");
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [feedCity, setFeedCity] = useState("All");
  const [loadingFeed, setLoadingFeed] = useState(false);

  // Fetch real PostgreSQL rooms preview for home page feed
  useEffect(() => {
    setLoadingFeed(true);
    const params = { limit: 8 };
    if (feedCity !== "All") params.city = feedCity;

    searchApi.searchRooms(params)
      .then(({ data }) => setFeaturedRooms(data.data?.items || []))
      .catch(() => {})
      .finally(() => setLoadingFeed(false));
  }, [feedCity]);

  // Redirect Owner and Admin roles inside useEffect to avoid rendering side-effects
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "owner") {
        navigate("/owner/listings", { replace: true });
      } else if (user?.role === "admin") {
        navigate("/admin/users", { replace: true });
      }
    }
  }, [isAuthenticated, user?.role, navigate]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDE_IMAGES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDE_IMAGES.length) % SLIDE_IMAGES.length);
  };

  // Auto-open Glassmorphism Login modal on initial screen load if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setAuthModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  // Auto carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchClick = () => {
    const query = new URLSearchParams();
    if (selectedCity) query.set("city", selectedCity);
    if (selectedType) query.set("propertyType", selectedType);
    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50 p-2 sm:p-4 lg:p-6 space-y-8 sm:space-y-12 overflow-x-hidden w-full max-w-full">
      {/* 1. Hero Section Container */}
      <section className="relative mx-auto flex min-h-[70vh] sm:min-h-[85vh] w-full max-w-7xl flex-col justify-center overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-[#1a293e] text-white shadow-2xl">
        {/* Background Image Carousel */}
        {SLIDE_IMAGES.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-55 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </div>
        ))}

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 z-1 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/40 to-[#0f172a]/30" />

        {/* Carousel Arrow Controls - Compact & Non-overlapping on mobile */}
        <button
          type="button"
          onClick={prevSlide}
          className="absolute left-2 sm:left-6 top-1/2 z-20 flex h-8 w-8 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/20 shrink-0"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} className="sm:h-6 sm:w-6" />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="absolute right-2 sm:right-6 top-1/2 z-20 flex h-8 w-8 sm:h-12 sm:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 border border-white/20 shrink-0"
          aria-label="Next slide"
        >
          <ChevronRight size={18} className="sm:h-6 sm:w-6" />
        </button>

        {/* Slide Indicators Dots */}
        <div className="absolute top-3 right-3 sm:top-6 sm:right-8 z-20 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/40 px-2.5 py-1 sm:px-4 sm:py-2 backdrop-blur-md border border-white/10">
          {SLIDE_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 sm:h-2.5 rounded-full transition-all ${
                idx === currentSlide ? "w-5 sm:w-7 bg-amber-500" : "w-2 sm:w-2.5 bg-white/50 hover:bg-white"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-12 lg:px-24 text-center my-auto py-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/20 px-3 py-1 text-[10px] sm:text-xs font-bold text-amber-300 backdrop-blur-md mb-3 sm:mb-4 animate-bounce">
            ✨ India's #1 Verified Room & Roommate Finder
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-7xl font-black tracking-tight text-white drop-shadow-2xl leading-tight max-w-4xl">
            Find Your Perfect <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent underline decoration-amber-500/50 underline-offset-4 sm:underline-offset-8">
              Room & Roommate
            </span>
          </h1>

          <p className="mt-3 sm:mt-6 max-w-xl text-xs sm:text-lg lg:text-xl font-medium text-slate-200 leading-relaxed drop-shadow-md">
            No Brokers • 100% Verified Owners • Instant Direct Chat
          </p>
        </div>
      </section>

      {/* 3. Popular Cities Section */}
      <section className="mx-auto w-full max-w-7xl px-2 sm:px-4 py-2 sm:py-4">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Popular Cities</h2>
          <p className="text-xs font-semibold text-slate-500">Explore verified room listings in top hubs</p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4">
          {POPULAR_CITIES.map((c) => (
            <div
              key={c.name}
              className="relative h-32 sm:h-40 overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-100 shadow-md select-none group cursor-pointer"
              onClick={() => navigate(`/rooms?city=${encodeURIComponent(c.name)}`)}
            >
              <img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent p-3 sm:p-4 flex flex-col justify-end">
                <h3 className="text-sm sm:text-lg font-black text-white">{c.name}</h3>
                <p className="text-[10px] sm:text-[11px] font-semibold text-amber-400">{c.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Live Room Feed (Social Post Style Feed) */}
      <section className="mx-auto w-full max-w-5xl px-2 sm:px-4 py-2 sm:py-4 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 mb-2">
              <Sparkles size={13} className="text-amber-500" />
              <span>Live Community Feed</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900">
              Live Room Posts & Host Listings
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Scroll through verified room posts. Like, share, and send instant direct messages straight to the owner's DM inbox!
            </p>
          </div>

          {/* Quick Chat Link */}
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95 shrink-0 self-start md:self-auto"
          >
            <MessageCircle size={16} />
            <span>Open Direct Chats</span>
          </Link>
        </div>

        {/* City Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {["All", "Delhi", "Noida", "Gurgaon", "Bengaluru", "Jaipur", "Mumbai"].map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => setFeedCity(city)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                feedCity === city
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {city === "All" ? "🌍 All Cities" : `📍 ${city}`}
            </button>
          ))}
        </div>

        {/* Post Feed Container */}
        {loadingFeed ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p className="mt-3 text-xs font-semibold text-slate-500">Loading verified room posts...</p>
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <Building2 size={32} className="mx-auto text-slate-400 mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No rooms listed in {feedCity} yet</h3>
            <p className="text-xs text-slate-500 mt-1">Be the first to list a room or explore other cities!</p>
            <button
              onClick={() => setFeedCity("All")}
              className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600"
            >
              Show All Cities
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredRooms.map((room) => (
              <RoomPostCard key={room._id || room.id} room={room} />
            ))}
          </div>
        )}

        {/* Explore All Button */}
        <div className="pt-4 text-center">
          <Link
            to="/rooms"
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-900 bg-white px-6 py-3 text-xs sm:text-sm font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
          >
            <span>Explore All Rooms & Map View</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 5. Why Choose RoomDekho Features Grid */}
      <section className="mx-auto w-full max-w-7xl px-2 sm:px-4 py-2 sm:py-4">
        <div className="rounded-3xl bg-amber-500/10 border border-amber-500/20 p-5 sm:p-12">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Why Choose RoomDekho?</h2>
            <p className="mt-1 text-xs font-bold text-slate-600">The safest platform for room hunting & roommate discovery</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border border-gray-100 text-center flex flex-col items-center">
                <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-amber-500 text-white font-black shadow-md shadow-amber-500/20 shrink-0">
                  <f.icon size={20} className="sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">{f.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs font-semibold text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auto-Triggered Glassmorphism Login Popup Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab="login"
      />
    </div>
  );
}
