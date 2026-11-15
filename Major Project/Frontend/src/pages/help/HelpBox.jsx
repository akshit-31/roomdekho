import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Info,
  HelpCircle
} from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import Button from "../../components/common/Button";
import { chatApi } from "../../services/api/chat.api";
import { useAuth } from "../../hooks/useAuth";

const INSTRUCTIONS = [
  {
    title: "1. Listing Approval & Updates",
    desc: "Naye room post karne ke baad ya price/photos update karne ke baad Admin ko direct message karein for fast-track approval."
  },
  {
    title: "2. KYC & Verified Trust Badge",
    desc: "Aap apna government ID proof (Aadhaar / PAN / Voter ID) Admin chat mein share karke 'Verified Host' badge pa sakte hain."
  },
  {
    title: "3. Direct 1-on-1 Realtime Chat",
    desc: "'Chat to Admin' button par click karte hi aapke Messages mein Admin ke sath direct private chat open ho jayegi."
  },
  {
    title: "4. Report Issues & Safety",
    desc: "Agar koi user, owner ya tenant suspicious lage ya terms violate kare, toh turant Admin ko report karein."
  },
  {
    title: "5. Response Time & Fee",
    desc: "Super Admin aamtaur par 5-10 minutes mein live reply deta hai. Support poori tarah 100% free aur confidential hai."
  }
];

export default function HelpBox() {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartAdminChat = async () => {
    setConnecting(true);
    setError(null);
    try {
      const { data } = await chatApi.createAdminConversation();
      const conversationId = data.data?._id || data.data?.id;
      if (conversationId) {
        navigate(`/chat/${conversationId}`);
      } else {
        navigate("/chat?support=admin");
      }
    } catch (err) {
      console.error("Failed to connect to admin:", err);
      // Fallback: Navigate to /chat where auto-connect runs
      navigate("/chat?support=admin");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <PageContainer
      title="Help Box & Admin Support"
      subtitle="Direct 1-on-1 priority support desk with Super Admin"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Priority "Chat to Admin" Hero Card */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white shadow-xl">
          {/* Decorative Glow */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-black/15 blur-2xl" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-black/30 border border-white/20 px-3.5 py-1 text-xs font-bold text-amber-200 backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span>Super Admin Online • Active Now</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Chat to Admin
              </h2>

              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                Kissi bhi help, listing approval, KYC verification ya platform issue ke liye Super Admin se direct baat karein.
              </p>

              <div className="flex flex-wrap gap-4 pt-1 text-xs text-white/90">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 size={15} className="text-emerald-300" /> Direct 1-on-1 Chat
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Clock size={15} className="text-emerald-300" /> Fast Response
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center sm:items-end gap-2">
              <Button
                onClick={handleStartAdminChat}
                loading={connecting}
                className="!bg-white !text-slate-900 hover:!bg-slate-100 font-black shadow-xl px-7 py-3.5 text-sm sm:text-base rounded-2xl flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 border border-white/80"
              >
                <MessageSquare size={19} className="text-amber-500 fill-amber-500/20" />
                <span>Chat to Admin</span>
                <ArrowRight size={16} className="text-slate-500" />
              </Button>
              <p className="text-[11px] text-white/80 font-medium">100% Free & Confidential</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Instructions / Guidelines Section */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl text-white">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/10">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Info size={18} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Instructions & Guidelines
              </h3>
              <p className="text-xs text-slate-300">
                Admin support se baat karne se pehle zaroori baatein
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {INSTRUCTIONS.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-2xl bg-slate-950/60 border border-white/10 p-4 transition-all hover:bg-white/[0.04] hover:border-amber-400/30"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-xs shadow-md">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-xs text-slate-300 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>RoomDekho Trust & Safety Verified</span>
            </div>
            <button
              onClick={handleStartAdminChat}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              Start Chat with Admin <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
