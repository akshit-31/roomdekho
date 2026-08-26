import { useState } from "react";
import { X, Sparkles, LogIn, UserPlus, ShieldCheck } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthModal({ isOpen, onClose, initialTab = "login" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Glass Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Glassmorphism Floating Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-slate-900/80 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all animate-scale-up text-white">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-amber-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-blue-500/30 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10 text-white/80 transition-all hover:bg-white/20 hover:text-white"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-400/20 to-amber-500/30 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-6 w-6 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">
            {activeTab === "login" ? "Welcome Back" : "Join RENTROOMO"}
          </h2>
          <p className="mt-1 text-xs text-slate-300">
            Log in or sign up to view room details & unlock roommate matches.
          </p>
        </div>

        {/* Tabs switcher */}
        <div className="mb-6 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/15 bg-black/40 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
              activeTab === "login"
                ? "bg-amber-500 text-white shadow-md border border-amber-400"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <LogIn size={15} /> Log In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all ${
              activeTab === "register"
                ? "bg-amber-500 text-white shadow-md border border-amber-400"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            <UserPlus size={15} /> Sign Up
          </button>
        </div>

        {/* Form Container */}
        <div className="glass-auth-form-wrap max-h-[70vh] overflow-y-auto pr-1">
          {activeTab === "login" ? (
            <LoginForm onSuccess={onClose} isModal />
          ) : (
            <RegisterForm onSuccess={onClose} isModal />
          )}
        </div>

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-white/10 pt-4 text-[11px] text-white/60">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Secure & Verified Platform</span>
        </div>
      </div>
    </div>
  );
}
