import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard, ShieldCheck, DoorOpen, Users, Sparkles, Heart, CalendarDays, MessageCircle, Home, PlusCircle, HelpCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import customLogo from "../../image copy 3.png";

const GENERAL_NAV_LINKS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/rooms", label: "Find a Room", icon: DoorOpen },
  { to: "/roommates", label: "Find a Roommate", icon: Users },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/help-box", label: "Help Box", icon: HelpCircle },
  { to: "/profile", label: "Profile", icon: User },
];

const OWNER_NAV_LINKS = [
  { to: "/owner", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/owner/listings", label: "Room Details", icon: DoorOpen },
  { to: "/owner/listings/new", label: "Add Room", icon: PlusCircle },
  { to: "/chat", label: "Seeker Chats", icon: MessageCircle },
  { to: "/owner/help", label: "Help Box", icon: HelpCircle },
  { to: "/profile", label: "Profile", icon: User },
];

const ADMIN_NAV_LINKS = [
  { to: "/admin/users", label: "User Management", icon: Users },
  { to: "/admin/listings", label: "Room Details", icon: DoorOpen },
  { to: "/admin/complaints", label: "Complaint Management", icon: MessageSquareWarning },
  { to: "/chat", label: "Chat Management", icon: MessageCircle },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUserMenuOpen(false);
      setDrawerOpen(false);
      navigate("/");
    }
  };

  const navLinks =
    user?.role === "admin"
      ? ADMIN_NAV_LINKS
      : user?.role === "owner"
      ? OWNER_NAV_LINKS
      : GENERAL_NAV_LINKS;

  return (
    <>
      {/* Slide-Out Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-2.5">
              <img src={customLogo} alt="RoomDekho Logo" className="h-9 w-9 object-contain" />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                RoomDekho
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">Navigation</p>
          <nav className="space-y-1">
            {navLinks.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setDrawerOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive ? "bg-amber-50 text-amber-600 shadow-sm border-l-4 border-amber-500" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={17} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {isAuthenticated ? (
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setDrawerOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all"
          >
            <User size={16} />
            <span>Login / Register</span>
          </Link>
        )}
      </aside>

      {/* Backdrop */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 border-b border-gray-100 backdrop-blur-md">
        <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3.5">
            {/* Universal Hamburger Icon Trigger - Rendered for drawer access */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 shrink-0"
              aria-label="Open Navigation Drawer"
            >
              <Menu size={18} />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-2 text-decoration-none">
              <img src={customLogo} alt="RoomDekho Logo" className="h-7 w-7 sm:h-9 sm:w-9 object-contain shrink-0" />
              <span className="text-base sm:text-xl font-extrabold tracking-tight text-slate-900">
                RoomDekho
              </span>
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 p-1 sm:p-1.5 pr-2.5 sm:pr-3 hover:bg-slate-50 transition-all"
                >
                  <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs shrink-0">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[70px] sm:max-w-[110px] truncate">
                    {user?.name || "Account"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-11 sm:top-12 w-48 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50">
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      <User size={15} /> My Profile
                    </Link>
                    {(user?.role === "owner" || user?.role === "admin") && (
                      <Link
                        to={user.role === "admin" ? "/admin" : "/owner"}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        {user.role === "admin" ? <ShieldCheck size={15} /> : <LayoutDashboard size={15} />}
                        Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-xl bg-amber-500 hover:bg-amber-600 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
