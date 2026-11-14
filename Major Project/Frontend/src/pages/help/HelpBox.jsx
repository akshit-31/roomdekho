import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  ShieldCheck,
  Headphones,
  HelpCircle,
  FileQuestion,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Building2,
  AlertCircle
} from "lucide-react";
import PageContainer from "../../components/layout/PageContainer";
import Button from "../../components/common/Button";
import { chatApi } from "../../services/api/chat.api";
import { useAuth } from "../../hooks/useAuth";

const FAQS = [
  {
    q: "How does the Room Owner verification & listing approval work?",
    a: "Once an owner submits their government ID proof (Aadhaar/PAN/Voter ID) and property details, our Super Admin verifies the credentials. Approved listings get the official 'Verified Owner' trust badge instantly."
  },
  {
    q: "How can I directly chat with Room Seekers or Roommates?",
    a: "Seekers can click 'Message Owner' on any room details page to start a direct, Instagram-style real-time chat. Owners can see all incoming seeker inquiries in their 'Seeker Chats' tab."
  },
  {
    q: "What should I do if a seeker or owner is unresponsive?",
    a: "You can message the Super Admin directly via this Help Desk. Admin will check the user's activity status or assist you in finding alternative verified listings."
  },
  {
    q: "Is there any brokerage or hidden fee on RoomDekho?",
    a: "No! RoomDekho is 100% direct owner-to-tenant and roommate-to-roommate platform. There are zero brokerages or platform commission fees."
  }
];

export default function HelpBox() {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);
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
      subtitle="Direct 1-on-1 priority support desk for Room Owners, Room Seekers, and Roommates"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Priority Admin Live Chat Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 p-6 sm:p-8 text-white shadow-xl">
          {/* Subtle decorative circles */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 h-56 w-56 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span>Super Admin is Online • Instant Reply</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Need Help, Verification or Listing Support?
              </h2>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                Connect directly with our dedicated Super Admin team. We resolve room approvals, tenant inquiries, account verification and platform questions in real-time.
              </p>

              <div className="flex flex-wrap gap-4 pt-1 text-xs text-white/80">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-300" /> 1-on-1 Direct Chat
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck size={15} className="text-emerald-300" /> Fast-track KYC
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock size={15} className="text-emerald-300" /> Avg reply: &lt; 5 mins
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              <Button
                onClick={handleStartAdminChat}
                loading={connecting}
                className="!bg-white !text-slate-900 hover:!bg-slate-100 font-extrabold shadow-lg px-6 py-3 text-sm rounded-2xl flex items-center gap-2 transition-all active:scale-95"
              >
                <MessageSquare size={18} className="text-amber-500" />
                Chat with Admin Now
              </Button>
              <p className="text-[11px] text-center text-white/70">Secure & Confidential Support</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Resolution Help Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Building2 size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Room Listing Approval</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Get your newly posted room listed faster or request urgent updates to pricing and photos.
            </p>
            <button
              onClick={handleStartAdminChat}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              Ask Admin <ArrowRight size={13} />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">KYC & Verified Badge</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Submit or verify your ID documents to receive the verified badge and build trust with seekers.
            </p>
            <button
              onClick={handleStartAdminChat}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Verify Now <ArrowRight size={13} />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Headphones size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1">Live Seeker Queries</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Need assistance handling a tenant visit or matching with verified roommates? We are here.
            </p>
            <button
              onClick={handleStartAdminChat}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1"
            >
              Open Support <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <FileQuestion size={18} className="text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900">Frequently Asked Questions</h3>
          </div>

          <div className="divide-y divide-slate-100">
            {FAQS.map((item, idx) => (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-800 hover:text-amber-600 transition-colors"
                >
                  <span>{item.q}</span>
                  {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed pr-4 animate-fade-in">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

