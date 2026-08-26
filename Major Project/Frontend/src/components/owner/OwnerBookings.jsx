import VisitCard from "../booking/VisitCard";
import EmptyState from "../common/EmptyState";

export default function OwnerBookings({ visits = [], onUpdated }) {
  if (!visits.length) {
    return <EmptyState title="No visits scheduled" description="Approved and pending property visits will show up here." />;
  }

  return (
    <div className="space-y-3">
      {visits.map((visit) => (
        <VisitCard key={visit._id} visit={visit} viewerRole="owner" onUpdated={onUpdated} />
      ))}
    </div>
  );
}
