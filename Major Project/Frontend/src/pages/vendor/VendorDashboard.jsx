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
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Heart,
  PlusCircle,
  UserPlus,
  SlidersHorizontal,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { searchApi } from "../../services/api/search.api";
import heroRoomBg from "../../assets/images/hero-room.jpg";
import placeholderRoom from "../../assets/images/placeholder-room.jpg";

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

const DEMO_ROOMS = [
  {
    _id: "demo-room-1",
    title: "Sector 62, Noida",
    rent: 8500,
    isVerified: true,
    roomType: "Private Room",
    furnishing: "Furnished",
    tag: "2 attached",
  },
  {
    _id: "demo-room-2",
    title: "Sector 15, Noida",
    rent: 6500,
    isVerified: true,
    roomType: "Sharing Room",
    furnishing: "Semi Furnished",
    tag: "1 attached",
  },
  {
    _id: "demo-room-3",
    title: "Sector 71, Noida",
    rent: 7000,
    isVerified: true,
    roomType: "Private Room",
    furnishing: "Furnished",
    tag: "1 attached",
  },
  {
    _id: "demo-room-4",
    title: "Sector 18, Noida",
    rent: 5500,
    isVerified: true,
    roomType: "Sharing Room",
    furnishing: "Semi Furnished",
    tag: "1 attached",
  },
];

const DEMO_ROOMMATES = [
  {
    _id: "rm-1",
    name: "Aman Verma",
    meta: "22 yrs • Male",
    profession: "Student",
    location: "Noida",
    matchScore: "92% Match",
    budget: "Budget: ₹6k - ₹9k",
  },
  {
    _id: "rm-2",
    name: "Neha Singh",
    meta: "21 yrs • Female",
    profession: "Student",
    location: "Greater Noida",
    matchScore: "92% Match",
    budget: "Budget: ₹5k - ₹8k",
  },
  {
    _id: "rm-3",
    name: "Vikas Patel",
    meta: "23 yrs • Male",
    profession: "Working",
    location: "Noida",
    matchScore: "85% Match",
    budget: "Budget: ₹7k - ₹10k",
  },
  {
    _id: "rm-4",
    name: "Priya Tiwari",
    meta: "22 yrs • Female",
    profession: "Student",
    location: "Noida",
    matchScore: "82% Match",
    budget: "Budget: ₹5k - ₹8k",
  },
];

export default function VendorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [modeToggle, setModeToggle] = useState("rooms");
  const [rooms, setRooms] = useState(DEMO_ROOMS);
  const [roommates, setRoommates] = useState(DEMO_ROOMMATES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [roomsRes, roommatesRes] = await Promise.all([
          searchApi.searchRooms({ limit: 4 }),
          searchApi.searchRoommates({ limit: 4 }),
        ]);

        if (roomsRes.data?.data?.items?.length) setRooms(roomsRes.data.data.items);
        if (roommatesRes.data?.data?.items?.length) setRoommates(roommatesRes.data.data.items);
      } catch (e) {
        console.error("Failed loading dashboard feed", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F7FE] text-slate-800 font-sans">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200/80 p-5 flex flex-col justify-between hidden md:flex sticky top-0 h-screen z-20">
        <div>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 px-2 mb-8 text-decoration-none">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-black text-lg shadow-md shadow-blue-500/20">
              <DoorOpen size={20} />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-blue-900 block leading-none">
                RoomMate
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                Find your perfect match
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {SIDEBAR_NAV.map(({ id, label, icon: Icon, badge }) => (
              <button
                key={id}
                onClick={() => setActiveNav(id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                  activeNav === id
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={activeNav === id ? "text-blue-600" : "text-slate-400"} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-extrabold text-white">
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
        {/* 2. Top Header Bar */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-between bg-white/80 backdrop-blur-md px-6 lg:px-10 border-b border-slate-200/60">
          {/* Global Search Input */}
          <div className="relative w-full max-w-md">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for rooms, locations or roommates..."
              className="w-full rounded-2xl border border-slate-200/80 bg-slate-50/80 pl-11 pr-4 py-2.5 text-xs font-semibold text-slate-700 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-4">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-all">
              <MessageCircle size={18} />
            </button>

            <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 transition-all">
              <Bell size={18} />
              <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-black text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                alt="User"
                className="h-10 w-10 rounded-full object-cover border border-blue-500/30"
              />
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {user?.name || "Rahul Sharma"}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">View Profile</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-6 lg:p-10 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Center Main Feed (8 cols on LG) */}
            <div className="lg:col-span-8 space-y-8">
              {/* 3. Hero Banner Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-100/50 p-6 sm:p-8 border border-blue-100 shadow-sm">
                <div className="relative z-10 max-w-lg">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-[11px] font-bold text-blue-700 mb-3">
                    Welcome back, {user?.name?.split(" ")[0] || "Rahul"}! 👋
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                    Find your perfect <span className="text-blue-600">room</span> or <span className="text-blue-600">roommate</span>
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
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Find Rooms
                    </button>
                    <button
                      onClick={() => setModeToggle("roommates")}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                        modeToggle === "roommates"
                          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                          : "bg-white text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Find Roommates
                    </button>
                  </div>
                </div>

                {/* Floating Filter Search Bar */}
                <div className="mt-6 rounded-2xl bg-white p-2.5 shadow-lg border border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                  <div className="flex items-center gap-2 px-3 py-2 border-r border-slate-100">
                    <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                    <input
                      type="text"
                      defaultValue="Noida, Uttar Pradesh"
                      className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2 border-r border-slate-100">
                    <Building2 size={16} className="text-blue-600 flex-shrink-0" />
                    <select className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer">
                      <option>Any Type</option>
                      <option>Private Room</option>
                      <option>Shared Room</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-2">
                    <SlidersHorizontal size={16} className="text-blue-600 flex-shrink-0" />
                    <select className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer">
                      <option>Any Budget</option>
                      <option>Under ₹8,000</option>
                      <option>₹8,000 - ₹15,000</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/rooms")}
                    className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 px-4 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
                  >
                    <Search size={15} /> Search
                  </button>
                </div>
              </div>

              {/* 4. Popular Rooms Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-slate-900">Popular Rooms</h3>
                  <Link to="/rooms" className="text-xs font-bold text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {rooms.slice(0, 4).map((room, idx) => (
                    <div
                      key={room._id || idx}
                      className="group rounded-2xl bg-white border border-slate-200/80 p-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100 mb-3">
                        <img
                          src={placeholderRoom}
                          alt={room.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow">
                          Verified
                        </span>
                        <button className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-slate-600 hover:text-red-500 backdrop-blur">
                          <Heart size={14} />
                        </button>
                      </div>

                      <div className="flex items-baseline justify-between">
                        <span className="text-sm font-black text-blue-600">
                          ₹{room.rent?.toLocaleString() || "8,500"}
                          <small className="text-[10px] font-medium text-slate-400">/month</small>
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 truncate">
                        {room.title || "Sector 62, Noida"}
                      </h4>
                      <div className="mt-2 flex flex-wrap gap-1 text-[10px] text-slate-500 font-semibold">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5">
                          {room.roomType || "Private Room"}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5">
                          {room.furnishing || "Furnished"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Top Roommates Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-extrabold text-slate-900">Top Roommates</h3>
                  <Link to="/roommates" className="text-xs font-bold text-blue-600 hover:underline">
                    View All
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {roommates.slice(0, 4).map((rm, idx) => (
                    <div
                      key={rm._id || idx}
                      className="rounded-2xl bg-white border border-slate-200/80 p-4 text-center shadow-sm hover:shadow-md transition-all"
                    >
                      <img
                        src={`https://i.pravatar.cc/150?img=${idx + 10}`}
                        alt={rm.name}
                        className="mx-auto h-14 w-14 rounded-full object-cover mb-2 border-2 border-blue-100"
                      />
                      <h4 className="text-xs font-bold text-slate-900">{rm.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">{rm.meta || "22 yrs • Student"}</p>

                      <div className="my-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-600">
                        <Sparkles size={11} /> {rm.matchScore || "92% Match"}
                      </div>

                      <p className="text-[11px] font-bold text-slate-700">{rm.budget || "Budget: ₹6k - ₹9k"}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Panel Widgets (4 cols on LG) */}
            <div className="lg:col-span-4 space-y-6">
              {/* 6. User Profile Card */}
              <div className="rounded-3xl bg-white border border-slate-200/80 p-6 text-center shadow-sm">
                <div className="relative inline-block mb-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
                    alt="User"
                    className="h-20 w-20 rounded-full object-cover border-4 border-blue-50 mx-auto shadow-md"
                  />
                  <span className="absolute bottom-0 right-0 flex items-center gap-1 rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-black text-white shadow">
                    <ShieldCheck size={10} /> Verified
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">
                  {user?.name || "Rahul Sharma"}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  Student • Male • 22 yrs
                </p>
                <p className="text-xs text-slate-500 font-semibold">Noida, Uttar Pradesh</p>

                <Link
                  to="/profile/edit"
                  className="mt-3 inline-block text-xs font-bold text-blue-600 hover:underline"
                >
                  Edit Profile
                </Link>

                {/* Profile Stats */}
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4">
                  <div className="text-center">
                    <Heart size={16} className="mx-auto text-blue-600 mb-1" />
                    <span className="block text-sm font-black text-slate-900">12</span>
                    <span className="text-[10px] font-semibold text-slate-400">Matches</span>
                  </div>
                  <div className="text-center">
                    <Bookmark size={16} className="mx-auto text-blue-600 mb-1" />
                    <span className="block text-sm font-black text-slate-900">08</span>
                    <span className="text-[10px] font-semibold text-slate-400">Saved</span>
                  </div>
                  <div className="text-center">
                    <MessageCircle size={16} className="mx-auto text-blue-600 mb-1" />
                    <span className="block text-sm font-black text-slate-900">03</span>
                    <span className="text-[10px] font-semibold text-slate-400">Messages</span>
                  </div>
                </div>
              </div>

              {/* 7. Quick Actions Card */}
              <div className="rounded-3xl bg-white border border-slate-200/80 p-5 shadow-sm">
                <h4 className="text-xs font-extrabold text-slate-900 mb-4 uppercase tracking-wider">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Link
                    to="/owner/add-listing"
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <PlusCircle size={16} className="text-blue-600" />
                      <span>Post a Room</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/roommates/me"
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserPlus size={16} className="text-blue-600" />
                      <span>Post a Roommate Profile</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </Link>

                  <Link
                    to="/profile/preferences"
                    className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings size={16} className="text-blue-600" />
                      <span>Update Preferences</span>
                    </div>
                    <ChevronRight size={15} className="text-slate-400" />
                  </Link>
                </div>
              </div>

              {/* 8. Complete Your Profile Widget */}
              <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 shadow-sm">
                <h4 className="text-sm font-extrabold text-slate-900">Complete Your Profile</h4>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  Increase your match score by completing your profile details.
                </p>

                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>75%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 mb-5">
                  <div className="h-full w-[75%] rounded-full bg-blue-600" />
                </div>

                <Link
                  to="/profile/edit"
                  className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all"
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
