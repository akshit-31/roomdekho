import RoommateCard from "./RoommateCard";
import EmptyState from "../common/EmptyState";
import Loader from "../common/Loader";
import roommateIcon from "../../assets/icons/roommate.svg";

export default function RoommateGrid({ roommates = [], matchesById = {}, loading = false }) {
  if (loading) return <Loader label="Finding compatible roommates..." />;

  if (!roommates.length) {
    return (
      <EmptyState
        icon={<img src={roommateIcon} alt="" className="h-16 w-16 opacity-40" />}
        title="No roommates found"
        description="Try widening your budget or location preferences to see more people."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {roommates.map((r) => (
        <RoommateCard key={r._id} roommate={r} match={matchesById[r._id]} />
      ))}
    </div>
  );
}
