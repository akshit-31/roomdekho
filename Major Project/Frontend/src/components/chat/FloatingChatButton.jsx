import { Link, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function FloatingChatButton() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Hide button if already on chat page
  if (location.pathname.startsWith("/chat")) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 animate-fade-in">
      <Link
        to="/chat"
        className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-3 sm:px-4 sm:py-3 text-white shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm border border-white/20"
        title="Open Direct Messages & Chats"
      >
        <div className="relative">
          <MessageCircle size={22} className="transition-transform group-hover:rotate-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
          </span>
        </div>

        <span className="hidden sm:inline text-xs font-black tracking-wide">
          Direct Chats & DMs
        </span>
      </Link>
    </div>
  );
}

