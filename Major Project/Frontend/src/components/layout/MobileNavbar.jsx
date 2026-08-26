import { NavLink } from "react-router-dom";
import { Home, Users, MessageCircle, Bell, User } from "lucide-react";
import clsx from "clsx";

const TABS = [
  { to: "/rooms", label: "Rooms", icon: Home },
  { to: "/roommates", label: "Roommates", icon: Users },
  { to: "/chat", label: "Chat", icon: MessageCircle },
  { to: "/notifications", label: "Alerts", icon: Bell },
  { to: "/profile", label: "Profile", icon: User },
];

/**
 * Bottom tab bar shown on small screens for authenticated users.
 * Complements Navbar's hamburger menu with quick one-tap access.
 */
export default function MobileNavbar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-gray-100 bg-white sm:hidden">
      {TABS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            clsx(
              "flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
              isActive ? "text-brand-600" : "text-gray-500"
            )
          }
        >
          <Icon size={20} />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
