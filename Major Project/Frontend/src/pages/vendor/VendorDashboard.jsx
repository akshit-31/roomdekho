import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Sparkles,
  MessageCircle,
  Bookmark,
  Building2,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ChevronRight,
  ShieldCheck,
  Heart,
  Phone,
  MessageSquareWarning,
  MapPin,
  SlidersHorizontal,
  UserPlus,
  PlusCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import customLogo from "../../image copy 3.png";

const SIDEBAR_NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "rooms", label: "Find Rooms", icon: DoorOpen },
  { id: "roommates", label: "Find Roommates", icon: Users },
  { id: "matches", label: "My Matches", icon: Heart },
  { id: "messages", label: "Messages", icon: MessageCircle, badge: 2 },
  { id: "saved", label: "Saved Listings", icon: Bookmark },
  { id: "listings", label: "My Listings", icon: Building2 },
  { id: "profile", label: "Profile", icon: User },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "owner") {
      navigate("/owner/listings", { replace: true });
    }
    if (user?.role === "admin") {
      navigate("/admin/users", { replace: true });
    }
  }, [user]);

  const [activeNav, setActiveNav] = useState("dashboard");
  const [modeToggle, setModeToggle] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Any Type");
  const [selectedBudget, setSelectedBudget] = useState("Any Budget");

  const fetchRealData = async () => {
    setLoading(true);
    try {
      const [roomsRes, roommatesRes] = await Promise.all([
        searchApi.searchRooms({
          limit: 8,
          city: locationQuery || undefined,
          propertyType: selectedType !== "Any Type" ? selectedType.toLowerCase() : undefined,
        }),
        searchApi.searchRoommates({ limit: 8 }),
      ]);

      setRooms(roomsRes.data?.data?.items || []);
      setRoommates(roommatesRes.data?.data?.items || []);
    } catch (e) {
      console.error("Failed loading real DB listings:", e);
      setRooms([]);
      setRoommates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealData();
  }, [selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRealData();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* 1. Integrated Left Sidebar Navigation (Matching Color Scheme) */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-20">
        <div>
          {/* Brand Logo - Custom Image + RoomDekho Text */}
          <Link to="/" className="flex items-center gap-2.5 px-2 mb-8 text-decoration-none">
            <img src={customLogo} alt="RoomDekho Logo" className="h-9 w-9 object-contain" />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">
                RoomDekho
              </span>
              <span className="text-[10px] font-semibold text-amber-600 mt-1 block">
                Find your perfect match
              </span>
            </div>
          </Link>

          {/* Navigation Links with Amber Highlight */}
          <nav className="space-y-1">
            {SIDEBAR_NAV.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveNav(id);
                  if (id === "rooms") navigate("/rooms");
                  if (id === "roommates") navigate("/roommates");
                  if (id === "messages") navigate("/chat");
                  if (id === "profile") navigate("/profile");
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  activeNav === id
                    ? "bg-amber-50 text-amber-600 shadow-sm border-l-4 border-amber-500"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={activeNav === id ? "text-amber-500" : "text-slate-400"} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-extrabold text-white">
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl bg-red-50/80 border border-red-100 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition-all"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Body Wrap */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white/95 backdrop-blur-md px-6 lg:px-10 border-b border-slate-200/80">
          {/* Mobile Hamburger Drawer Trigger */}
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("vendor-sidebar");
              if (el) el.classList.toggle("hidden");
            }}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-all mr-3"
            aria-label="Toggle navigation menu"
          >
            <Search size={18} />
          </button>

          {/* Global Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for rooms, locations or roommates..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-amber-500 focus:outline-none transition-all"
            />
          </form>

          {/* Header Right Actions */}
          <div className="flex items-center gap-4">
            <Link to="/chat" className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-all">
              <MessageCircle size={18} />
            </Link>

            <Link to="/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-all">
              <Bell size={18} />
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-white">
                3
              </span>
            </Link>

            <Link to="/profile" className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow shadow-amber-500/20">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || "Divya Gupta"}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">View Profile</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-6 lg:p-10 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Center Main Feed (8 cols on LG) */}
            <div className="lg:col-span-8 space-y-8">
              {/* Hero Banner Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 via-amber-100/40 to-amber-50 p-6 sm:p-8 border border-amber-200/60 shadow-sm">
                <div className="relative z-10 max-w-lg">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-bold text-amber-800 mb-3 border border-amber-200">
                    Welcome back, {user?.name?.split(" ")[0] || "Partner"}! 👋
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    Find your perfect <span className="text-amber-600">room</span> or <span className="text-amber-600">roommate</span>
                  </h2>
                  <p className="mt-2 text-xs font-medium text-slate-500">
                    Verified listings. Trusted people. Better matches.
                  </p>

                  {/* Mode Selector Toggle */}
                  <div className="mt-5 flex items-center gap-2">
                    <button
                      onClick={() => setModeToggle("rooms")}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        modeToggle === "rooms"
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Find Rooms
                    </button>
                    <button
                      onClick={() => setModeToggle("roommates")}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        modeToggle === "roommates"
                          ? "bg-amber-500 text-white shadow-md shadow-amber-500/20"
                          : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Find Roommates
                    </button>
                  </div>
                </div>

                {/* Floating Filter Search Bar */}
                <form onSubmit={handleSearchSubmit} className="mt-6 rounded-2xl bg-white p-2.5 shadow-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <div className="flex items-center gap-2 px-3 py-2 border-r border-slate-100">
                    <MapPin size={16} className="text-amber-500 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Delhi, Noida, Jaipur..."
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 border-r border-slate-100">
                    <Building2 size={16} className="text-amber-500 flex-shrink-0" />
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Any Type">Any Type</option>
                      <option value="Apartment">Apartment</option>
                      <option value="Flat">Shared Flat</option>
                      <option value="Independent">Independent</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2">
                    <SlidersHorizontal size={16} className="text-amber-500 flex-shrink-0" />
                    <select
                      value={selectedBudget}
                      onChange={(e) => setSelectedBudget(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                    >
                      <option value="Any Budget">Any Budget</option>
                      <option value="8000">Under ₹8,000</option>
                      <option value="15000">₹8,000 - ₹15,000</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 px-4 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all"
                  >
                    <Search size={15} /> Search
                  </button>
                </form>
              </div>

              {/* Real Database Rooms Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-slate-900">
                    {modeToggle === "rooms" ? "Real Property Listings (Posted by Owners)" : "Real Compatible Roommates"}
                  </h3>
                  <Link
                    to={modeToggle === "rooms" ? "/rooms" : "/roommates"}
                    className="text-xs font-bold text-amber-600 hover:underline"
                  >
                    View All →
                  </Link>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-xs font-bold text-slate-400 animate-pulse">
                    Fetching real listings from PostgreSQL database...
                  </div>
                ) : modeToggle === "rooms" ? (
                  rooms.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
                      No property listings found in database for this filter.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {rooms.map((room) => (
                        <div
                          key={room._id || room.id}
                          onClick={() => navigate(`/rooms/${room._id || room.id}`)}
                          className="group rounded-2xl bg-white border border-slate-200/80 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 mb-3">
                            <img
                              src={room.media?.[0]?.url || room.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400"}
                              alt={room.title}
                              className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                            />
                            {room.isVerified && (
                              <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                                Verified
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-600 hover:text-red-500 backdrop-blur"
                            >
                              <Heart size={14} />
                            </button>
                          </div>

                          <div className="flex items-baseline justify-between">
                            <span className="text-sm font-black text-amber-600">
                              ₹{(room.rent || 7500).toLocaleString()}
                              <small className="text-[10px] font-medium text-slate-400">/month</small>
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                            {room.title || `${room.locality || "Sector 62"}, ${room.city || "Noida"}`}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                            📍 {room.locality ? `${room.locality}, ` : ""}{room.city || "Delhi"}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-500 font-semibold">
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 capitalize">
                              {room.roomType || room.room_type || "Private Room"}
                            </span>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 capitalize">
                              {room.furnishing || "Furnished"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  /* Roommates Grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {roommates.map((rm, idx) => (
                      <div
                        key={rm._id || rm.id || idx}
                        onClick={() => navigate(`/roommates/${rm._id || rm.id}`)}
                        className="rounded-2xl bg-white border border-slate-200/80 p-4 text-center shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="mx-auto h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-extrabold text-base mb-2 border-2 border-amber-200">
                          {rm.name?.[0]?.toUpperCase() || "R"}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 truncate">{rm.name || "Roommate"}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{rm.role || "Seeker"}</p>

                        <div className="my-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-600">
                          <Sparkles size={11} /> 92% Match
                        </div>

                        <p className="text-[11px] font-bold text-slate-700">Budget: ₹6k - ₹12k</p>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right Panel Widgets (4 cols on LG) */}
            <div className="lg:col-span-4 space-y-6">
              {/* User Profile Card */}
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 text-center shadow-sm">
                <div className="relative inline-block mb-3">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-white">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black text-white shadow">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {user?.name || "Divya Gupta"}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5 capitalize">
                  {user?.role || "Vendor / Seeker"} Account
                </p>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {user?.email || "seeker1@roomdekho.com"}
                </p>

                <Link
                  to="/profile/edit"
                  className="mt-3 inline-block text-xs font-bold text-amber-600 hover:underline"
                >
                  Edit Profile
                </Link>

                {/* Profile Stats */}
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <Link to="/matches" className="text-center">
                    <Heart size={16} className="mx-auto text-amber-500 mb-1" />
                    <span className="block text-sm font-black text-slate-900">12</span>
                    <span className="text-[10px] font-semibold text-slate-400">Matches</span>
                  </Link>
                  <Link to="/favorites" className="text-center">
                    <Bookmark size={16} className="mx-auto text-amber-500 mb-1" />
                    <span className="block text-sm font-black text-slate-900">08</span>
                    <span className="text-[10px] font-semibold text-slate-400">Saved</span>
                  </Link>
                  <Link to="/chat" className="text-center">
                    <MessageCircle size={16} className="mx-auto text-amber-500 mb-1" />
                    <span className="block text-sm font-black text-slate-900">03</span>
                    <span className="text-[10px] font-semibold text-slate-400">Messages</span>
                  </Link>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Link
                    to="/owner/add-listing"
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <PlusCircle size={16} className="text-amber-500" />
                      <span>Post a Room</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/roommates/me"
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserPlus size={16} className="text-amber-500" />
                      <span>Post a Roommate Profile</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/profile/preferences"
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-amber-50 hover:text-amber-600 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings size={16} className="text-amber-500" />
                      <span>Update Preferences</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* Complete Your Profile Widget */}
              <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 p-6 shadow-sm">
                <h4 className="text-sm font-extrabold text-slate-900">Complete Your Profile</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Increase your match score by completing your profile details.
                </p>

                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>75%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 mb-5">
                  <div className="h-full w-[75%] rounded-full bg-amber-500" />
                </div>

                <Link
                  to="/profile/edit"
                  className="flex w-full items-center justify-center rounded-xl bg-amber-500 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all"
                >
                  Complete Now
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
