import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  DoorOpen,
  Users,
  CalendarDays,
  MessageCircle,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Building2,
  SlidersHorizontal,
  MapPin,
  Heart,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { searchApi } from "../../services/api/search.api";
import PropertyGrid from "../../components/property/PropertyGrid";
import RoommateGrid from "../../components/roommate/RoommateGrid";

const VENDOR_TABS = [
  { id: "rooms", label: "Find Rooms", icon: DoorOpen },
  { id: "roommates", label: "Find Roommates", icon: Users },
  { id: "visits", label: "My Visits & Bookings", icon: CalendarDays },
  { id: "messages", label: "Direct Messages", icon: MessageCircle },
];

export default function VendorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("rooms");
  const [rooms, setRooms] = useState([]);
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadVendorData() {
      setLoading(true);
      try {
        const [roomsRes, roommatesRes] = await Promise.all([
          searchApi.searchRooms({ limit: 12 }),
          searchApi.searchRoommates({ limit: 12 }),
        ]);

        setRooms(roomsRes.data?.data?.items || []);
        setRoommates(roommatesRes.data?.data?.items || []);
      } catch (err) {
        console.error("Failed to load vendor data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVendorData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-8 lg:px-12">
      {/* Header Banner */}
      <div className="mx-auto max-w-7xl mb-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-900/40 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300 border border-amber-500/30 mb-3">
              <Sparkles size={14} /> Vendor & Seeker Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome, {user?.name || "Vendor Partner"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300">
              Browse verified rooms, discover compatible roommates, and manage your visits.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/chat"
              className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-white border border-white/20 hover:bg-white/20 transition-all"
            >
              <MessageCircle size={16} /> Messages
            </Link>
            <Link
              to="/visits"
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all"
            >
              <CalendarDays size={16} /> My Visits
            </Link>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="mx-auto max-w-7xl">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-4 mb-6 scrollbar-none">
          {VENDOR_TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2.5 rounded-2xl px-5 py-3 text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === id
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20 scale-[1.02]"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content: Rooms Search */}
        {activeTab === "rooms" && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="relative w-full sm:w-96">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search city, locality, or landmark..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/rooms")}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  <Filter size={15} /> All Filters
                </button>
              </div>
            </div>

            <PropertyGrid rooms={rooms} loading={loading} />
          </div>
        )}

        {/* Tab Content: Roommates */}
        {activeTab === "roommates" && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Compatible Roommates</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Find people matching your lifestyle and budget.</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/roommates")}
                  className="text-xs font-bold text-amber-600 hover:underline"
                >
                  Explore All →
                </button>
              </div>
            </div>

            <RoommateGrid roommates={roommates} loading={loading} />
          </div>
        )}

        {/* Tab Content: Visits */}
        {activeTab === "visits" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
            <CalendarDays size={40} className="mx-auto text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Your Property Visits</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Track your scheduled room visits and owner confirmations.
            </p>
            <button
              onClick={() => navigate("/visits")}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600"
            >
              View My Scheduled Visits
            </button>
          </div>
        )}

        {/* Tab Content: Messages */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm text-center">
            <MessageCircle size={40} className="mx-auto text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">Vendor Direct Chat</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
              Connect with property owners and potential roommates directly.
            </p>
            <button
              onClick={() => navigate("/chat")}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-amber-600"
            >
              Open Messaging Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
