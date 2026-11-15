import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, ShieldCheck, Zap, HeartHandshake, ArrowRight, MessageCircle, Sparkles } from "lucide-react";
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

  // Auto-open Glassmorphism Login modal on initial screen load if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setTimeout(() => {
        setAuthModalOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const handleSearchClick = () => {
    const query = new URLSearchParams();
    if (selectedCity) query.set("city", selectedCity);
    if (selectedType) query.set("propertyType", selectedType);
    navigate(`/rooms?${query.toString()}`);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-slate-50 p-2 sm:p-4 lg:p-6 space-y-8 sm:space-y-12 overflow-x-hidden w-full max-w-full">
      {/* 1. Hero Section Container with Full Background Video */}
      <section className="relative mx-auto flex min-h-[70vh] sm:min-h-[85vh] w-full max-w-7xl flex-col justify-center overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-[#0b1322] text-white shadow-2xl">
        {/* Full Cinematic YouTube Video Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <iframe
            className="absolute top-1/2 left-1/2 w-[350%] h-[350%] sm:w-[160%] sm:h-[160%] -translate-x-1/2 -translate-y-1/2 object-cover"
            src="https://www.youtube-nocookie.com/embed/B9MRxkpzZH8?autoplay=1&mute=1&loop=1&playlist=B9MRxkpzZH8&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1&playsinline=1"
            title="RoomDekho Cinematic Video Tour"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          {/* High-res fallback poster */}
          <div className="absolute inset-0 -z-10">
            <img
              src={SLIDE_IMAGES[0]}
              alt="RoomDekho Interior"
              className="h-full w-full object-cover object-center"
            />
          </div>
          {/* Cinematic Dark Gradient Overlay for perfect text contrast & readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1322] via-[#0b1322]/70 to-[#0b1322]/50 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-slate-950/30" />
        </div>

        {/* Live Tour Indicator Badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md border border-white/20 text-xs font-semibold text-white shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <span>Live 360° Room Tour</span>
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

          {/* Quick Chat Link - Shown ONLY when Authenticated */}
          {isAuthenticated && (
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95 shrink-0 self-start md:self-auto"
            >
              <MessageCircle size={16} />
              <span>Open Direct Chats</span>
            </Link>
          )}
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
