import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
  Building2,
  Eye,
  CalendarCheck,
  ArrowRight,
  TrendingUp,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  DoorOpen
} from "lucide-react";
import OwnerStats from "../../components/owner/OwnerStats";
import EnquiryList from "../../components/owner/EnquiryList";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import { ownerApi } from "../../services/api/owner.api";
import { propertyApi } from "../../services/api/property.api";
import { useAuth } from "../../hooks/useAuth";
import { formatCurrency } from "../../utils/formatCurrency";

export default function OwnerDashboard() {
  const [stats, setStats] = useState({});
  const [enquiries, setEnquiries] = useState([]);
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [dashRes, enqRes, roomsRes] = await Promise.allSettled([
          ownerApi.dashboard(),
          ownerApi.enquiries(),
          propertyApi.mine({ limit: 4 })
        ]);

        if (dashRes?.status === "fulfilled") {
          const d = dashRes.value?.data?.data || dashRes.value?.data || {};
          setStats(d);
        }
        if (enqRes?.status === "fulfilled") {
          const enqData = enqRes.value?.data?.data || enqRes.value?.data || [];
          setEnquiries(Array.isArray(enqData) ? enqData.slice(0, 5) : []);
        }
        if (roomsRes?.status === "fulfilled") {
          const items = roomsRes.value?.data?.data?.items || roomsRes.value?.data?.items || [];
          setMyRooms(Array.isArray(items) ? items.slice(0, 4) : []);
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();

    // Auto-read GPS position for owner
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          localStorage.setItem("user_gps", JSON.stringify(coords));
        },
        () => {},
        { timeout: 8000, enableHighAccuracy: true }
      );
    }
  }, []);

  if (loading) return <Loader label="Loading your Host Dashboard..." />;

  const isKycVerified = user?.is_kyc_verified || user?.kyc?.status === "verified";

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Host Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-amber-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <Building2 size={13} className="text-amber-400" />
                <span>Property Host Portal</span>
              </span>
              {isKycVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300">
                  <ShieldCheck size={13} /> KYC Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                  <Sparkles size={12} /> Standard Host
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || "Property Owner"}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Manage your room listings, chat in real-time with verified room seekers, and access direct Super Admin support anytime.
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link to="/owner/listings/new">
              <Button
                icon={Plus}
                className="!bg-gradient-to-r !from-amber-500 !to-orange-500 hover:!from-amber-600 hover:!to-orange-600 !text-white font-bold rounded-2xl shadow-lg px-4 py-2.5 text-xs sm:text-sm"
              >
                Add Room
              </Button>
            </Link>

            <Link to="/chat">
              <Button
                variant="secondary"
                icon={MessageCircle}
                className="!bg-white/15 !text-white hover:!bg-white/25 !border-white/20 font-bold rounded-2xl text-xs sm:text-sm"
              >
                Seeker Chats
              </Button>
            </Link>

            <Link to="/owner/help">
              <Button
                variant="secondary"
                icon={HelpCircle}
                className="!bg-white/15 !text-amber-300 hover:!bg-white/25 !border-white/20 font-bold rounded-2xl text-xs sm:text-sm"
              >
                Help Box
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Owner Performance KPI Metrics */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Activity Overview</h2>
          <span className="text-xs text-slate-500 flex items-center gap-1">
            <TrendingUp size={13} className="text-emerald-500" /> Updated in real-time
          </span>
        </div>
        <OwnerStats stats={stats} />
      </div>

      {/* 3. Two-Column Layout: Direct Seeker Chats vs Direct Admin Support */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Inbound Seeker Messages & Leads (Instagram DMs) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle size={18} className="text-amber-500" />
                Seeker Inquiries & Direct Messages
              </h2>
              <p className="text-xs text-slate-500">Live chat messages from seekers looking for rooms</p>
            </div>
            <Link
              to="/chat"
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Open Full Chat <ArrowRight size={13} />
            </Link>
          </div>

          <EnquiryList enquiries={enquiries} />
        </div>

        {/* Right Col: Admin Support Help Desk Card */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <HelpCircle size={16} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Admin Help Box</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Online
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Need fast approval for your room, KYC verification assistance, or have inquiries regarding tenant deposits?
            </p>

            <div className="space-y-2 mb-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>1-on-1 Instant DM with Super Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Fast-track listing approval in 15 mins</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                <span>Zero brokerage disputes support</span>
              </div>
            </div>

            <Link to="/owner/help" className="block">
              <Button className="w-full !bg-amber-500 hover:!bg-amber-600 !text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2">
                <MessageCircle size={14} />
                Open Help Box & Chat
              </Button>
            </Link>
          </div>

          {/* Quick Stats Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide mb-3">Quick Navigation</h3>
            <div className="space-y-2">
              <Link
                to="/owner/listings"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Building2 size={16} className="text-amber-500" /> Manage All Room Listings
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
              <Link
                to="/profile"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-500" /> KYC & Personal Profile
                </span>
                <ArrowRight size={13} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 4. My Listings Snapshot */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 size={18} className="text-amber-500" />
              My Listed Rooms
            </h2>
            <p className="text-xs text-slate-500">Live preview of properties you are currently hosting</p>
          </div>
          <Link
            to="/owner/listings"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            View All ({myRooms.length}) <ArrowRight size={13} />
          </Link>
        </div>

        {myRooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <DoorOpen size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No rooms listed yet</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Add your room photos, rent details and location to start receiving direct seeker inquiries!
            </p>
            <div className="mt-4">
              <Link to="/owner/listings/new">
                <Button icon={Plus} size="sm">Add First Listing</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {myRooms.map((room) => {
              const coverImg = room.media?.[0]?.url || room.images?.[0] || "/images/placeholder-room.jpg";
              return (
                <div
                  key={room._id || room.id}
                  className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                >
                  <div className="relative h-36 bg-slate-100 overflow-hidden">
                    <img
                      src={coverImg}
                      alt={room.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <span className="absolute top-2 left-2 rounded-full bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
                      {room.status === "available" ? "🟢 Available" : "Occupied"}
                    </span>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{room.title}</h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin size={11} className="text-amber-500" />
                        {room.address?.locality || room.city}, {room.address?.city || room.locality || ""}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-extrabold text-amber-600">
                        {formatCurrency(room.pricing?.rent || room.rent || 0)}/mo
                      </span>

                      <div className="flex items-center gap-1.5">
                        <Link
                          to={`/rooms/${room._id || room.id}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="View Room Page"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <Link
                          to={`/owner/listings/${room._id || room.id}/edit`}
                          className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700 hover:bg-amber-500 hover:text-white transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
