import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, User, LayoutDashboard, ShieldCheck, DoorOpen, Users, Sparkles, Heart, CalendarDays, MessageCircle, Home } from "lucide-react";
import logo from "../../assets/images/room-logo.png";
import { useAuth } from "../../hooks/useAuth";

const SIDE_LINKS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/rooms", label: "Find a Room", icon: DoorOpen },
  { to: "/roommates", label: "Find a Roommate", icon: Users },
  { to: "/matches", label: "My Matches", icon: Sparkles },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/visits", label: "My Visits", icon: CalendarDays },
  { to: "/chat", label: "Messages", icon: MessageCircle },
  { to: "/profile", label: "My Profile", icon: User },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      setUserMenuOpen(false);
      setSidebarOpen(false);
      navigate("/");
    }
  };

  return (
    <>
      {/* Slide-Out Navigation Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <Link to="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-lg shadow-md shadow-amber-500/20">
                R
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">
                RoomDekho
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-2">Navigation</p>
          <nav className="space-y-1">
            {SIDE_LINKS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all ${
                    isActive ? "bg-amber-50 text-amber-600 shadow-sm" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-xs font-bold text-red-600 hover:bg-red-100 transition-all"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            onClick={() => setSidebarOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-amber-600 transition-all"
          >
            <User size={16} />
            <span>Login / Register</span>
          </Link>
        )}
      </aside>

      {/* Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Top Header Navbar */}
      <header className="sticky top-0 z-30 bg-white/95 border-b border-gray-100 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
          <div className="flex items-center gap-4">
            {/* Hamburger Icon Trigger */}
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all"
              aria-label="Open Navigation Drawer"
            >
              <Menu size={20} />
            </button>

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 text-decoration-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-white font-black text-xl shadow-md shadow-amber-500/20">
                R
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                RoomDekho
              </span>
            </Link>
          </div>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? "text-amber-500 font-bold" : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              About us
            </NavLink>
            <NavLink
              to="/rooms"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? "text-amber-500 font-bold" : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              Properties
            </NavLink>
            <NavLink
              to="/roommates"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? "text-amber-500 font-bold" : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              Pricing
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? "text-amber-500 font-bold" : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              Contact us
            </NavLink>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-5">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 p-1.5 pr-3 hover:bg-slate-50 transition-all"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white font-bold text-xs">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                    {user?.name || "Account"}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-48 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl z-50">
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
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Login
              </Link>
            )}

            <Link
              to={isAuthenticated ? (user?.role === "owner" ? "/owner/add-listing" : "/rooms") : "/login"}
              className="rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-all active:scale-95"
            >
              Post Property
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
