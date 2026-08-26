import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  MoreVertical,
  MessageCircle,
  User,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Home,
  Heart,
  CalendarDays,
  Users,
  Sparkles,
  DoorOpen,
} from "lucide-react";
import clsx from "clsx";
import logo from "../../assets/images/room-logo.png";
import { useAuth } from "../../hooks/useAuth";
import NotificationBell from "../notifications/NotificationBell";

const NAV_LINKS = [
  { to: "/rooms", label: "Find a Room" },
  { to: "/roommates", label: "Find a Roommate" },
  { to: "/matches", label: "My Matches" },
];

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

export default function Navbar({ sidebarOpen, onToggleSidebar }) {
  const { user, isAuthenticated, logout } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboardRoute =
    location.pathname.startsWith("/owner") || location.pathname.startsWith("/admin");

  const handleLogout = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await logout();
    } finally {
      setMoreOpen(false);
      navigate("/");
    }
  };

  return (
    <>
      <aside
        className={clsx(
          "app-sidebar",
          !sidebarOpen && "app-sidebar-collapsed",
          isDashboardRoute && "app-sidebar-dashboard"
        )}
      >
        <Link to="/" className="sidebar-brand">
          <img src={logo} alt="Room" />
          <span>
            Room Searcher
            <small>&amp; Roommate</small>
          </span>
        </Link>

        {!isDashboardRoute && (
          <>
            <p className="sidebar-label">Explore</p>
            <nav className="sidebar-nav">
              {SIDE_LINKS.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => {
                    if (window.innerWidth < 1024) onToggleSidebar?.();
                  }}
                  className={({ isActive }) =>
                    clsx("sidebar-link", isActive && "sidebar-link-active")
                  }
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </NavLink>
              ))}
            </nav>
          </>
        )}

        <div className="sidebar-bottom">
          <div className="sidebar-note">
            <span className="sidebar-note-dot" />
            <div>
              <strong>Find your fit</strong>
              <span>Rooms and roommates in one place.</span>
            </div>
          </div>

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            <span>{isAuthenticated ? "Logout" : "Login"}</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onToggleSidebar}
        />
      )}

      <header className={clsx("topbar", isDashboardRoute && "topbar-dashboard")}>
        <div className="topbar-inner">
          <div className="topbar-left">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={onToggleSidebar}
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              title={sidebarOpen ? "Hide navigation" : "Show navigation"}
            >
              <Menu size={20} />
            </button>

            <Link to="/" className="mobile-brand">
              <img src={logo} alt="Room" />
              <span>Room Searcher</span>
            </Link>
          </div>

          <nav className="top-nav">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  clsx("top-nav-link", isActive && "top-nav-link-active")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="topbar-actions">
            {isAuthenticated ? (
              <>
                <Link to="/chat" className="icon-button" aria-label="Messages">
                  <MessageCircle size={19} />
                </Link>

                <NotificationBell />

                {(user?.role === "owner" || user?.role === "admin") && (
                  <Link
                    to={user.role === "admin" ? "/admin" : "/owner"}
                    className="dashboard-button"
                  >
                    {user.role === "admin" ? (
                      <ShieldCheck size={16} />
                    ) : (
                      <LayoutDashboard size={16} />
                    )}
                    Dashboard
                  </Link>
                )}

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMoreOpen((value) => !value)}
                    className="more-button"
                    aria-label="Account menu"
                  >
                    <MoreVertical size={21} />
                  </button>

                  {moreOpen && (
                    <div className="account-menu">
                      <Link
                        to="/profile"
                        onClick={() => setMoreOpen(false)}
                        className="account-menu-link"
                      >
                        <User size={15} /> My Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="account-menu-link account-menu-logout"
                      >
                        <LogOut size={15} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  className="more-button"
                  onClick={() => setMoreOpen((value) => !value)}
                  aria-label="Login and signup menu"
                  title="Login / Sign up"
                >
                  <MoreVertical size={21} />
                </button>

                {moreOpen && (
                  <div className="account-menu">
                    <Link
                      to="/login"
                      onClick={() => setMoreOpen(false)}
                      className="account-menu-link"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMoreOpen(false)}
                      className="account-menu-link account-menu-signup"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </header>

    </>
  );
}
