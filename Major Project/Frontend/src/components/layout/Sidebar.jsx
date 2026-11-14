import { NavLink } from "react-router-dom";
import clsx from "clsx";
import {
  LayoutDashboard, Home, PlusCircle, User, MessageCircle, HelpCircle,
  Users, ShieldCheck, Flag, AlertTriangle,
  CreditCard, BarChart3, Settings, Star, MessageSquareWarning,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

const OWNER_LINKS = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/owner/listings", label: "Room Details", icon: Home },
  { to: "/owner/listings/new", label: "Add Room", icon: PlusCircle },
  { to: "/chat", label: "Seeker Chats", icon: MessageCircle },
  { to: "/owner/help", label: "Help Box", icon: HelpCircle },
  { to: "/profile", label: "Profile", icon: User },
];

const ADMIN_LINKS = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/kyc", label: "Owner Approvals", icon: ShieldCheck },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/listings", label: "Listings", icon: Home },
  { to: "/admin/reports", label: "Reports", icon: Flag },
  { to: "/admin/fraud", label: "Fraud Detection", icon: AlertTriangle },
  { to: "/admin/complaints", label: "Complaints", icon: MessageSquareWarning },
  { to: "/admin/reviews", label: "Review Moderation", icon: Star },
  { to: "/admin/payments", label: "Payments", icon: CreditCard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Platform Settings", icon: Settings },
];

export default function Sidebar() {
  const { user } = useAuth();
  const links = user?.role === "admin" ? ADMIN_LINKS : OWNER_LINKS;

  return (
    <aside className="hidden w-60 shrink-0 border-r border-gray-100 bg-white px-3 py-6 lg:block">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        {user?.role === "admin" ? "Admin" : "Owner"} Dashboard
      </p>
      <nav className="flex flex-col gap-0.5">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive ? "bg-brand-50 text-brand-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
