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
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMe());
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isDashboardRoute =
    (isAuthenticated && location.pathname === "/") ||
    location.pathname.startsWith("/owner") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/vendor");

  return (
    <div className="flex min-h-screen flex-col app-shell bg-[#F4F7FE] text-slate-900">
      {!isDashboardRoute && <Navbar />}
      <main className="flex-1">
        <AppRoutes />
      </main>
      {!isDashboardRoute && <Footer />}
    </div>
  );
}
