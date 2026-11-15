import { useState, useEffect, useRef } from "react";
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
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [feedCity, setFeedCity] = useState("All");
  const [loadingFeed, setLoadingFeed] = useState(false);
  const videoRef = useRef(null);

  // Guarantee seamless background video autoplay on all desktop and mobile browsers
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

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

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden w-full max-w-full text-white">
      {/* 1. Fixed Full-Page Cinematic Background Video (Downloaded Web-Optimized MP4: Zero YouTube UI, Never pauses, Infinite loop) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={SLIDE_IMAGES[0]}
          className="h-full w-full object-cover object-center pointer-events-none"
        >
          <source src="/videos/hero-bg.mp4" type="video/mp4" />
        </video>
        {/* Transparent Subtle Vignette Overlay - Keeps video crystal clear & bright */}
        <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[0.5px] z-0 pointer-events-none" />
      </div>

      {/* 2. Floating Hero Section (Compact & Sleek with Interactive Arrow Hover Shine) */}
      <section className="relative z-10 w-full min-h-[38vh] sm:min-h-[46vh] flex flex-col justify-center items-center text-center px-4 pt-10 sm:pt-14 pb-4 sm:pb-6">
        {/* Live Tour Indicator Badge */}
        <div className="absolute top-3 right-4 sm:top-5 sm:right-8 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3.5 py-1.5 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-white shadow-xl">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span>Live 360° Room Tour</span>
        </div>

        {/* Top Floating Badge with Hover Glow */}
        <div className="group cursor-pointer inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-black/60 px-5 py-1.5 text-xs sm:text-sm font-bold text-amber-300 backdrop-blur-md mb-3 sm:mb-4 shadow-xl transition-all duration-300 hover:scale-105 hover:border-amber-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)]">
          <Sparkles size={15} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
          <span>India's #1 Verified Room & Roommate Finder</span>
        </div>

        {/* Hero Heading with Interactive Arrow Hover Light-Beam Shine */}
        <div className="group relative cursor-pointer select-none inline-block max-w-5xl px-3 py-1 transition-transform duration-300 hover:scale-[1.02]">
          {/* Shimmer Light Streak Beam across text on hover */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12" />
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12] drop-shadow-[0_6px_25px_rgba(0,0,0,0.95)] group-hover:drop-shadow-[0_0_40px_rgba(251,191,36,0.6)] transition-all duration-500">
            Find Your Perfect <br />
            <span className="relative inline-block bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent underline decoration-amber-500/70 underline-offset-8 sm:underline-offset-10 group-hover:from-yellow-300 group-hover:via-white group-hover:to-amber-400 transition-all duration-500">
              Room & Roommate
            </span>
          </h1>
        </div>

        {/* Sub-tagline */}
        <p className="mt-3 sm:mt-4 max-w-2xl text-xs sm:text-lg lg:text-xl font-extrabold text-slate-100 leading-relaxed drop-shadow-[0_3px_15px_rgba(0,0,0,0.95)] hover:text-amber-200 transition-colors duration-300">
          No Brokers • 100% Verified Owners • Instant Direct Chat
        </p>
      </section>

      {/* 3. Floating Popular Cities Section (Brought back up, perfectly placed below hero) */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)] flex items-center gap-2.5">
            <MapPin size={24} className="text-amber-400" />
            <span>Popular Cities</span>
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-200 drop-shadow mt-1">
            Explore verified room listings in top student & job hubs
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
          {POPULAR_CITIES.map((c) => (
            <div
              key={c.name}
              className="group relative h-36 sm:h-48 lg:h-52 overflow-hidden rounded-2xl sm:rounded-3xl border border-white/25 bg-slate-950/40 backdrop-blur-md shadow-2xl transition-all duration-300 hover:scale-105 hover:border-amber-400/60 hover:shadow-amber-500/30 select-none cursor-pointer"
              onClick={() => navigate(`/rooms?city=${encodeURIComponent(c.name)}`)}
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent p-4 sm:p-5 flex flex-col justify-end">
                <h3 className="text-base sm:text-xl font-black text-white group-hover:text-amber-300 transition-colors drop-shadow">
                  {c.name}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-amber-400 drop-shadow mt-0.5">
                  {c.count}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Live Room Feed ("Living Bala") - Scrolls smoothly over the background video */}
      <section className="relative z-10 mx-auto w-full max-w-5xl px-3 sm:px-6 py-6 sm:py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300 mb-2 backdrop-blur-md">
              <Sparkles size={13} className="text-amber-400" />
              <span>Live Community Feed</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Live Room Posts & Host Listings
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-200 drop-shadow mt-1">
              Scroll through verified room posts. Like, share, and send instant direct messages straight to the owner's DM inbox!
            </p>
          </div>

          {/* Quick Chat Link - Shown ONLY when Authenticated */}
          {isAuthenticated && (
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95 shrink-0 self-start md:self-auto border border-amber-300/30"
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
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition-all backdrop-blur-md ${
                feedCity === city
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/30"
                  : "bg-slate-900/70 border border-white/20 text-slate-200 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              {city === "All" ? "🔥 All Cities" : `📍 ${city}`}
            </button>
          ))}
        </div>

        {/* Post Feed Container */}
        {loadingFeed ? (
          <div className="py-12 text-center rounded-3xl bg-slate-900/60 backdrop-blur-md border border-white/10 text-slate-300">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
            <p className="mt-3 text-xs font-semibold">Loading verified room posts...</p>
          </div>
        ) : featuredRooms.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/20 bg-slate-900/60 backdrop-blur-md p-10 text-center">
            <Building2 size={32} className="mx-auto text-slate-400 mb-2" />
            <h3 className="text-sm font-bold text-white">No rooms listed in {feedCity} yet</h3>
            <p className="text-xs text-slate-300 mt-1">Be the first to list a room or explore other cities!</p>
            <button
              onClick={() => setFeedCity("All")}
              className="mt-4 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 shadow-md"
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
            className="inline-flex items-center gap-2 rounded-2xl bg-white hover:bg-slate-100 px-6 py-3 text-xs sm:text-sm font-black text-slate-900 transition-all shadow-xl hover:scale-105 active:scale-95 border border-white/40"
          >
            <span>Explore All Rooms & Map View</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* 5. Why Choose RoomDekho Features Grid */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-3 sm:px-6 py-8 sm:py-12">
        <div className="rounded-3xl bg-slate-900/70 backdrop-blur-xl border border-white/15 p-6 sm:p-12 shadow-2xl">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight drop-shadow">
              Why Choose RoomDekho?
            </h2>
            <p className="mt-1 text-xs sm:text-sm font-bold text-amber-400">
              The safest platform for room hunting & roommate discovery
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl bg-slate-950/60 backdrop-blur-md p-5 sm:p-6 shadow-lg border border-white/10 text-center flex flex-col items-center hover:border-amber-400/40 transition-all hover:scale-105"
              >
                <div className="mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black shadow-md shadow-amber-500/30 shrink-0">
                  <f.icon size={20} className="sm:h-6 sm:w-6" />
                </div>
                <h3 className="text-sm sm:text-base font-extrabold text-white">{f.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs font-semibold text-slate-300 leading-relaxed">{f.desc}</p>
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
