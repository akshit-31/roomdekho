import { Link } from "react-router-dom";
import placeholder from "../../assets/images/placeholder-room.jpg";
import PropertyStatus from "../property/PropertyStatus";
import ListingActions from "./ListingActions";
import EmptyState from "../common/EmptyState";
import { formatCurrency } from "../../utils/formatCurrency";

export default function ListingTable({ rooms = [], onChanged }) {
  if (!rooms.length) {
    return <EmptyState title="No listings yet" description="Add your first property to start receiving enquiries." actionLabel="Add a listing" onAction={() => (window.location.href = "/owner/listings/new")} />;
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl text-white shadow-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs uppercase text-amber-400/90 font-bold bg-slate-950/40">
            <th className="px-4 py-3 font-bold">Listing</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Rent</th>
            <th className="px-4 py-3 font-bold">Views</th>
            <th className="px-4 py-3 font-bold">Enquiries</th>
            <th className="px-4 py-3 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id} className="border-b border-white/10 last:border-0 hover:bg-white/[0.03] transition-colors">
              <td className="px-4 py-3">
                <Link to={`/rooms/${room._id}`} className="flex items-center gap-3">
                  <img src={room.media?.[0]?.url || placeholder} alt="" className="h-10 w-14 rounded-lg object-cover border border-white/10" />
                  <span className="line-clamp-1 max-w-[200px] font-bold text-white hover:text-amber-300 transition-colors">{room.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3"><PropertyStatus status={room.status} /></td>
              <td className="px-4 py-3 text-slate-200 font-semibold">{formatCurrency(room.rent)}</td>
              <td className="px-4 py-3 text-slate-300">{room.stats?.views ?? 0}</td>
              <td className="px-4 py-3 text-slate-300">{room.stats?.enquiries ?? 0}</td>
              <td className="px-4 py-3"><ListingActions room={room} onChanged={onChanged} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
