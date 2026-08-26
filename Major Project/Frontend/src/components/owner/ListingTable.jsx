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
    <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
            <th className="px-4 py-3 font-medium">Listing</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Rent</th>
            <th className="px-4 py-3 font-medium">Views</th>
            <th className="px-4 py-3 font-medium">Enquiries</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room._id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3">
                <Link to={`/rooms/${room._id}`} className="flex items-center gap-3">
                  <img src={room.media?.[0]?.url || placeholder} alt="" className="h-10 w-14 rounded-lg object-cover" />
                  <span className="line-clamp-1 max-w-[200px] font-medium text-gray-900">{room.title}</span>
                </Link>
              </td>
              <td className="px-4 py-3"><PropertyStatus status={room.status} /></td>
              <td className="px-4 py-3 text-gray-700">{formatCurrency(room.rent)}</td>
              <td className="px-4 py-3 text-gray-700">{room.stats?.views ?? 0}</td>
              <td className="px-4 py-3 text-gray-700">{room.stats?.enquiries ?? 0}</td>
              <td className="px-4 py-3"><ListingActions room={room} onChanged={onChanged} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
