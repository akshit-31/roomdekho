import { useState } from "react";
import { X, Sparkles, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({ isOpen, onClose, initialTab = "login" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Glass Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Glassmorphism Floating Card */}
      <div className="relative my-auto w-full max-w-sm sm:max-w-md max-h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-slate-900/90 p-5 sm:p-7 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all animate-scale-up text-white z-10">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-amber-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-blue-500/25 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
          aria-label="Close modal"
        >
          <X size={16} />
        </button>

        {/* Modal Header */}
        <div className="mb-4 flex flex-col items-center text-center shrink-0">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-400/20 to-amber-500/30 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            {activeTab === "login" ? "Welcome Back" : "Join RoomDekho"}
          </h2>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-300">
            Log in or sign up to view room details & unlock roommate matches.
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="mb-4 grid grid-cols-2 gap-1 rounded-2xl border border-white/15 bg-black/40 p-1 backdrop-blur-md shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
              activeTab === "login"
                ? "bg-amber-500 text-white shadow-md border border-amber-400"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <LogIn size={14} /> Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all ${
              activeTab === "register"
                ? "bg-amber-500 text-white shadow-md border border-amber-400"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <UserPlus size={14} /> Sign Up
          </button>
        </div>

        {/* Scrollable Form Container */}
        <div className="overflow-y-auto pr-1 flex-1 custom-scrollbar">
          {activeTab === "login" ? (
            <LoginForm onSuccess={onClose} isModal />
          ) : (
            <RegisterForm onSuccess={onClose} isModal />
          )}
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center gap-1.5 border-t border-white/10 pt-3 text-[10px] sm:text-[11px] text-white/60 shrink-0">
          <ShieldCheck size={13} className="text-emerald-400" />
          <span>Secure & Verified Platform</span>
        </div>
      </div>
    </div>
  );
}
