import { Link } from "react-router-dom";
import { MapPin, Sparkles } from "lucide-react";
import verifiedIcon from "../../assets/icons/verified.svg";
import placeholder from "../../assets/images/placeholder-room.jpg";
import { formatCurrency } from "../../utils/formatCurrency";
import PropertyStatus from "./PropertyStatus";
import FavoriteButton from "./FavoriteButton";

export default function PropertyCard({ room }) {
  const cover = room.media?.[0]?.url || (Array.isArray(room.images) && room.images[0]) || placeholder;

  return (
    <Link
      to={`/rooms/${room._id || room.id}`}
      className="group block overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:border-amber-400/50 hover:scale-[1.02] transition-all duration-300 text-white"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <img
          src={cover}
          alt={room.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-2.5 top-2.5 flex gap-1.5">
          <PropertyStatus status={room.status} />
          {room.isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-md">
              <Sparkles size={11} className="text-amber-400" /> Verified
            </span>
          )}
        </div>
        <FavoriteButton roomId={room._id || room.id} className="absolute right-2.5 top-2.5" />
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm sm:text-base font-extrabold text-white group-hover:text-amber-300 transition-colors">
            {room.title}
          </h3>
        </div>

        <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
          <p className="flex items-center gap-1 truncate">
            <MapPin size={13} className="text-amber-400 shrink-0" />
            {room.address?.locality ? `${room.address.locality}, ` : ""}
            {room.address?.city || room.city || "Delhi NCR"}
          </p>
          {room.distance !== undefined && room.distance !== null && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              📍 {room.distance} km
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <div>
            <span className="text-base sm:text-lg font-black text-amber-400">
              {formatCurrency(room.pricing?.rent || room.rent || 0)}
            </span>
            <span className="text-[11px] font-medium text-slate-400">/mo</span>
          </div>

          <span className="text-xs font-bold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
