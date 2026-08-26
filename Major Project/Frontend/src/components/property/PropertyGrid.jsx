import PropertyCard from "./PropertyCard";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";

export default function PropertyGrid({ rooms = [], loading = false, emptyTitle = "No rooms found", emptyDescription }) {
  if (loading) return <Loader label="Finding rooms for you..." />;

  if (!rooms.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription || "Try adjusting your filters or search a different area."} />;
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {rooms.map((room) => (
        <PropertyCard key={room._id} room={room} />
      ))}
    </div>
  );
}
