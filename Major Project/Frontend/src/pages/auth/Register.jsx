import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";
import customLogo from "../../image copy 3.png";
import RegisterForm from "../../components/auth/RegisterForm";

export default function Register() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Glow Spheres */}
      <div className="pointer-events-none absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-amber-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />

      {/* Glassmorphism Floating Card */}
      <div className="relative my-auto w-full max-w-sm sm:max-w-md flex flex-col overflow-hidden rounded-3xl border border-white/20 bg-slate-900/80 p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] backdrop-blur-2xl text-white z-10">
        {/* Brand Logo Header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <Link to="/" className="mb-4 flex items-center justify-center gap-2">
            <img src={customLogo} alt="RoomDekho Logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-extrabold tracking-tight text-white">
              RoomDekho
            </span>
          </Link>

          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-400/20 to-amber-500/30 shadow-lg backdrop-blur-sm">
            <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Create Your Account</h2>
          <p className="mt-1 text-xs text-slate-300">
            Join RoomDekho to view verified rooms & connect with roommates.
          </p>
        </div>

        {/* Glassmorphism Form Body */}
        <RegisterForm />

        {/* Security badge */}
        <div className="mt-6 flex items-center justify-center gap-1.5 border-t border-white/10 pt-4 text-xs text-white/60">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Secure & Verified Platform</span>
        </div>
      </div>
    </div>
  );
}
