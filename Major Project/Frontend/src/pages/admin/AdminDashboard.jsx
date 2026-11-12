import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  DoorOpen,
  MessageSquareWarning,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MapPin,
  Phone,
  Mail,
  FileText,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import AdminStats from "../../components/admin/AdminStats";
import Loader from "../../components/common/Loader";
import Button from "../../components/common/Button";
import { adminApi } from "../../services/api/admin.api";
import defaultAvatar from "/images/default-avatar.jpg";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [pendingOwners, setPendingOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);

  const loadData = async () => {
    try {
      const [analyticsRes, kycRes] = await Promise.all([
        adminApi.analytics().catch(() => ({ data: { data: {} } })),
        adminApi.kycQueue().catch(() => ({ data: { data: [] } })),
      ]);
      setStats(analyticsRes.data?.data || {});
      const allOwners = kycRes.data?.data || [];
      setPendingOwners(allOwners.filter((o) => o.approvalStatus === "pending"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDecision = async (userId, status) => {
    setActingId(userId);
    try {
      await adminApi.reviewKyc(userId, { status });
      await loadData();
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <Loader label="Loading admin overview..." />;

  const SHORTCUTS = [
    {
      to: "/admin/kyc",
      label: "Owner Approvals",
      icon: ShieldCheck,
      badge: pendingOwners.length > 0 ? `${pendingOwners.length} Pending` : null,
      highlight: pendingOwners.length > 0,
    },
    { to: "/admin/users", label: "User Management", icon: Users },
    { to: "/admin/listings", label: "Room Details", icon: DoorOpen },
    { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
    { to: "/chat", label: "Chat Support", icon: MessageCircle },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Overview</h1>
          <p className="text-sm text-gray-500">Platform health & real-time moderation portal</p>
        </div>

        {pendingOwners.length > 0 && (
          <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-1.5 text-xs font-bold text-amber-700">
            <Clock size={15} className="animate-spin text-amber-600" />
            <span>{pendingOwners.length} Room Owner(s) Awaiting Approval</span>
          </div>
        )}
      </div>

      {/* KPI Stats */}
      <AdminStats stats={stats} />

      {/* 🚀 QUICK ACTION: PENDING OWNER APPROVALS SECTION */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                Room Owner Approvals (Action Required)
                {pendingOwners.length > 0 && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {pendingOwners.length} New
                  </span>
                )}
              </h2>
              <p className="text-xs text-gray-500">
                Verify property location and identity before activating owner accounts
              </p>
            </div>
          </div>

          <Link
            to="/admin/kyc"
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Approvals</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {pendingOwners.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 py-8 text-center">
            <CheckCircle2 size={36} className="text-emerald-500 mb-2" />
            <p className="text-sm font-bold text-emerald-800">All Room Owners Approved!</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              There are no pending owner verification requests at this moment.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {pendingOwners.slice(0, 5).map((owner) => (
              <div
                key={owner._id}
                className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-amber-200/60 bg-amber-50/30 p-4 transition-all hover:bg-amber-50/60 hover:shadow-sm"
              >
                {/* Owner info */}
                <div className="flex items-start gap-3">
                  <img
                    src={owner.avatarUrl || defaultAvatar}
                    alt=""
                    className="h-11 w-11 rounded-xl object-cover border border-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900">{owner.name}</p>
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-extrabold text-amber-700">
                        Pending Approval
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail size={12} className="text-gray-400" /> {owner.email}
                      </span>
                      {owner.phone && (
                        <span className="flex items-center gap-1 font-medium">
                          <Phone size={12} className="text-gray-400" /> {owner.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Property Location details */}
                <div className="flex flex-col sm:flex-row gap-2.5 lg:max-w-md">
                  <div className="flex-1 rounded-xl bg-white p-2.5 text-xs border border-gray-100 shadow-2xs">
                    <p className="font-bold text-gray-700 flex items-center gap-1 text-[11px] text-amber-700">
                      <MapPin size={12} /> Property Location:
                    </p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {owner.property?.locality ? `${owner.property.locality}, ` : ""}
                      {owner.property?.city || "Delhi"}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-1">
                      {owner.property?.address || "Address provided during signup"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white p-2.5 text-xs border border-gray-100 shadow-2xs min-w-[140px]">
                    <p className="font-bold text-gray-700 flex items-center gap-1 text-[11px] text-blue-700">
                      <FileText size={12} /> ID Proof:
                    </p>
                    <p className="font-semibold text-gray-900 mt-0.5">
                      {owner.kyc?.idType || "Aadhaar Card"}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {owner.kyc?.idNumberMasked || "Submitted"}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    icon={CheckCircle2}
                    className="!bg-emerald-600 hover:!bg-emerald-700 text-xs font-bold"
                    loading={actingId === owner._id}
                    onClick={() => handleDecision(owner._id, "approved")}
                  >
                    Approve & Activate
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    icon={XCircle}
                    className="text-xs font-bold"
                    loading={actingId === owner._id}
                    onClick={() => handleDecision(owner._id, "rejected")}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Shortcuts Grid */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-3">Management Modules</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {SHORTCUTS.map(({ to, label, icon: Icon, badge, highlight }) => (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-2.5 rounded-2xl border p-5 text-center transition-all hover:shadow-md ${
                highlight
                  ? "border-amber-400 bg-amber-50/50 shadow-xs"
                  : "border-gray-100 bg-white"
              }`}
            >
              {badge && (
                <span className="absolute top-2 right-2 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                  {badge}
                </span>
              )}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  highlight
                    ? "bg-amber-500 text-white"
                    : "bg-brand-50 text-brand-600"
                }`}
              >
                <Icon size={22} />
              </div>
              <span className="text-xs font-bold text-gray-900">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
