import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Send,
  Heart,
  Share2,
  MapPin,
  ShieldCheck,
  Building2,
  CalendarDays,
  Sparkles,
  Wifi,
  Wind,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Phone,
  ArrowRight
} from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import placeholderRoom from "../../assets/images/placeholder-room.jpg";
import FavoriteButton from "./FavoriteButton";
import { formatCurrency } from "../../utils/formatCurrency";
import { timeAgo } from "../../utils/formatDate";
import { chatApi } from "../../services/api/chat.api";
import { useAuth } from "../../hooks/useAuth";

const DEFAULT_ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
];

const QUICK_INQUIRIES = [
  "Hi! Is this room still available?",
  "When can I visit for room inspection?",
  "Can we discuss move-in date & deposit?"
];

export default function RoomPostCard({ room }) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const owner = room.owner || {};
  const ownerId = owner._id || owner.id || room.owner_id;
  const isOwnerVerified = owner.isKycVerified || owner.is_kyc_verified || room.isVerified || room.is_verified;

  // Extract images
  const mediaList = room.media?.map(m => m.url).filter(Boolean) || [];
  const imageList = room.images?.filter(Boolean) || [];
  const allImages = [...mediaList, ...imageList];
  const images = allImages.length > 0 ? allImages : DEFAULT_ROOM_IMAGES;

  const nextImg = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/rooms/${room._id || room.id}`;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || messageText).trim();
    if (!text) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/" } } });
      return;
    }

    if (!ownerId) {
      navigate("/chat");
      return;
    }

    // Check if user is trying to message their own room
    if (String(ownerId) === String(user?.id || user?._id)) {
      alert("This is your own room listing.");
      return;
    }

    setSending(true);
    try {
      // 1. Create or get existing conversation with room owner
      const { data: convRes } = await chatApi.createConversation(ownerId);
      const convId = convRes.data?._id || convRes.data?.id;

      if (convId) {
        // 2. Send the message directly into that conversation
        const fullMessage = `[Regarding: ${room.title}]\n${text}`;
        await chatApi.sendMessage(convId, { text: fullMessage, content: fullMessage });

        setSendSuccess(true);
        setMessageText("");

        // 3. Smooth transition straight into the Instagram-style live chat thread
        setTimeout(() => {
          navigate(`/chat/${convId}`);
        }, 800);
      }
    } catch (err) {
      console.error("Direct message send failed:", err);
      // Fallback: Jump to chat with ownerId
      navigate(`/chat?ownerId=${ownerId}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* 1. Post Header: Host Profile & Location (Instagram Post Header style) */}
      <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-[2px]">
              <img
                src={owner.avatarUrl || owner.avatar || defaultAvatar}
                alt={owner.name || "Room Owner"}
                className="h-11 w-11 rounded-full object-cover border-2 border-white"
              />
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                {owner.name || "Verified Property Host"}
              </h3>
              {isOwnerVerified && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                  <ShieldCheck size={11} className="text-amber-600" /> Verified Host
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 flex-wrap">
              <MapPin size={11} className="text-amber-500 shrink-0" />
              <span className="truncate">
                {room.locality || room.address?.locality ? `${room.locality || room.address?.locality}, ` : ""}{room.city || room.address?.city || "Delhi NCR"}
              </span>
              {room.distance !== undefined && room.distance !== null && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  📍 {room.distance} km away
                </span>
              )}
              <span className="text-slate-300">·</span>
              <span>{timeAgo(room.createdAt || room.created_at)}</span>
            </p>
          </div>
        </div>

        {/* Room Price Badge */}
        <div className="text-right shrink-0">
          <p className="text-base sm:text-lg font-black text-amber-600">
            {formatCurrency(room.rent || room.pricing?.rent || 0)}
            <span className="text-[11px] font-medium text-slate-400">/mo</span>
          </p>
          <span className="text-[10px] text-slate-400">
            Deposit: {formatCurrency(room.deposit || room.pricing?.deposit || room.rent || 0)}
          </span>
        </div>
      </div>

      {/* 2. Post Media: High Quality Room Images Carousel */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-900 overflow-hidden select-none group">
        <img
          src={images[currentImgIndex]}
          alt={room.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
        />

        {/* Overlays */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-md flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Available Now
          </span>

          <span className="rounded-full bg-amber-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold text-white uppercase tracking-wider shadow-md">
            {room.room_type || room.property_type || "Private Room"}
          </span>
        </div>

        {/* Image Indicators */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImg}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md hover:bg-slate-900/80 transition-all active:scale-95 border border-white/20"
              aria-label="Previous photo"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={nextImg}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/60 text-white backdrop-blur-md hover:bg-slate-900/80 transition-all active:scale-95 border border-white/20"
              aria-label="Next photo"
            >
              <ChevronRight size={16} />
            </button>

            <div className="absolute bottom-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-white">
              {currentImgIndex + 1}/{images.length}
            </div>
          </>
        )}
      </div>

      {/* 3. Post Action Strip (Instagram style: Like, DM, Share, View) */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Like / Favorite Button */}
          <FavoriteButton roomId={room._id || room.id} className="static shadow-none border border-slate-200 hover:border-rose-300" />

          {/* DM Button */}
          <button
            type="button"
            onClick={() => handleSendMessage("Hi, I saw your room post and want to connect!")}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-all active:scale-95"
            title="Chat directly with owner"
          >
            <MessageCircle size={15} className="text-amber-500" />
            <span>Chat (DM)</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all active:scale-95"
            title="Share Room Post"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* View Full Room Details Page */}
        <Link
          to={`/rooms/${room._id || room.id}`}
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group"
        >
          <span>Details</span>
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* 4. Post Content: Title, Description & Amenities */}
      <div className="p-4 sm:p-5 space-y-3 flex-1 bg-white">
        <div>
          <h4 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
            {room.title}
          </h4>
          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {room.description || "Spacious, well-ventilated verified room with 24/7 security, proper water supply, and direct owner management."}
          </p>
        </div>

        {/* Amenities Chips */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {room.amenities.slice(0, 5).map((amenity, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700"
              >
                <Sparkles size={10} className="text-amber-500" />
                {amenity}
              </span>
            ))}
            {room.amenities.length > 5 && (
              <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
                +{room.amenities.length - 5} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* 5. Direct Contact Box: Message goes straight to Room Owner (Instagram DM bar) */}
      <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
          <span className="flex items-center gap-1 text-slate-700">
            <MessageCircle size={13} className="text-amber-500" /> Quick Message to Host:
          </span>
          <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Delivers straight to Owner's DM
          </span>
        </div>

        {/* Quick Instant Message Chips */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_INQUIRIES.map((msg, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(msg)}
              disabled={sending}
              className="text-[10px] sm:text-[11px] font-medium text-slate-700 bg-white border border-slate-200/90 rounded-full px-2.5 py-1 shadow-2xs hover:border-amber-400 hover:bg-amber-50 hover:text-amber-800 transition-all active:scale-95"
            >
              💬 {msg}
            </button>
          ))}
        </div>

        {/* Custom Message Input Bar */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`Message ${owner.name || "Owner"} directly...`}
              disabled={sending || sendSuccess}
              className="w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={(!messageText.trim() && !sending) || sendSuccess}
            className="flex h-9 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 text-xs font-bold text-white shadow-sm hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shrink-0"
          >
            {sending ? (
              <span className="animate-spin text-xs">⏳</span>
            ) : sendSuccess ? (
              <span className="flex items-center gap-1 text-emerald-200">
                <CheckCircle2 size={14} /> Sent!
              </span>
            ) : (
              <>
                <Send size={13} />
                <span>Send</span>
              </>
            )}
          </button>
        </div>

        {sendSuccess && (
          <p className="text-[10px] text-center text-emerald-600 font-bold animate-fade-in flex items-center justify-center gap-1">
            <CheckCircle2 size={12} /> Message delivered! Opening your direct chat with {owner.name || "Owner"}...
          </p>
        )}
      </div>
    </article>
  );
}

