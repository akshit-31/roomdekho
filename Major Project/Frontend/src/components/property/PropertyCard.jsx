import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import verifiedIcon from "../../assets/icons/verified.svg";
import placeholder from "../../assets/images/placeholder-room.jpg";
import { formatCurrency } from "../../utils/formatCurrency";
import PropertyStatus from "./PropertyStatus";
import FavoriteButton from "./FavoriteButton";

export default function PropertyCard({ room }) {
  const cover = room.media?.[0]?.url || placeholder;

  return (
    <Link
      to={`/rooms/${room._id}`}
      className="property-card-shell group block overflow-hidden rounded-2xl border bg-white transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={cover}
          alt={room.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex gap-1.5">
          <PropertyStatus status={room.status} />
          {room.isVerified && (
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-brand-700 backdrop-blur">
              <img src={verifiedIcon} alt="" className="h-3 w-3" /> Verified
            </span>
          )}
        </div>
        <FavoriteButton roomId={room._id} className="absolute right-2 top-2" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">{room.title}</h3>
        </div>

        <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
          <p className="flex items-center gap-1 truncate">
            <MapPin size={13} className="text-amber-500 shrink-0" />
            {room.address?.locality ? `${room.address.locality}, ` : ""}
            {room.address?.city}
          </p>
          {room.distance !== undefined && room.distance !== null && (
            <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
              📍 {room.distance} km
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-base font-semibold text-gray-900">
            {formatCurrency(room.rent)}
            <span className="text-xs font-normal text-gray-400">/mo</span>
          </p>
          {room.occupancy?.genderPreference && room.occupancy.genderPreference !== "any" && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users size={13} />
              {room.occupancy.genderPreference === "male" ? "Boys" : "Girls"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
