import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { fetchMe } from "./store/user/user.store";
import { useAuth } from "./hooks/useAuth";

/**
 * Root shell: Navbar + routed content + Footer. Dashboard routes
 * (/owner/*, /admin/*) swap this chrome for
 * components/layout/DashboardLayout via their own route element.
 */
export default function App() {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMe());
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isDashboardRoute = location.pathname.startsWith("/owner") || location.pathname.startsWith("/admin");

  return (
    <div
      className={clsx(
        "flex min-h-screen flex-col app-shell",
        isDashboardRoute ? "" : sidebarOpen ? "lg:pl-56" : "lg:pl-0"
      )}
    >
      {!isDashboardRoute && (
        <Navbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((value) => !value)}
        />
      )}
      <main className="flex-1 pb-14 sm:pb-0">
        <AppRoutes />
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}
