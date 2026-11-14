import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import CompleteProfileModal from "./components/profile/CompleteProfileModal";
import FloatingChatButton from "./components/chat/FloatingChatButton";
import { fetchMe } from "./store/user/user.store";
import { checkSession } from "./store/auth/auth.store";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useAuth();
  const { profile: userProfile } = useSelector((s) => s.user);
  const location = useLocation();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMe());
  }, [isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isDashboardRoute =
    location.pathname.startsWith("/owner") ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/vendor");

  // Show profile completion modal if user is authenticated and profile is not completed
  const showCompleteProfile =
    Boolean(isAuthenticated && userProfile && userProfile.isProfileCompleted === false && userProfile.role !== "admin");

  return (
    <div className="flex min-h-screen flex-col app-shell bg-[#F4F7FE] text-slate-900 w-full max-w-full overflow-x-hidden">
      {!isDashboardRoute && <Navbar />}
      <main className="flex-1 w-full max-w-full overflow-x-hidden">
        <AppRoutes />
      </main>
      {!isDashboardRoute && <Footer />}

      {/* Mandatory Onboarding Profile & Location Setup Modal */}
      <CompleteProfileModal isOpen={showCompleteProfile} user={userProfile} />

      {/* Floating 1-Click Chat & DMs Action Button */}
      <FloatingChatButton />
    </div>
  );
}
