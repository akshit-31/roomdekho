import { Link } from "react-router-dom";
import defaultAvatar from "/images/default-avatar.jpg";
import MatchScore from "./MatchScore";
import ConnectButton from "../roommate/ConnectButton";

/**
 * Row-style card for the "My Matches" list — pairs a MatchScore with the
 * candidate's basic info and a ConnectButton, one row per Match document.
 */
export default function MatchCard({ match }) {
  const person = match.otherUser || {};

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <Link to={`/roommates/${person._id}`} className="flex items-center gap-3">
        <img
          src={person.avatarUrl || defaultAvatar}
          alt={person.name}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-900">{person.name}</p>
          <p className="line-clamp-1 text-xs text-gray-500">{match.explanation}</p>
        </div>
      </Link>

      <div className="flex items-center gap-4 sm:gap-6">
        <MatchScore score={match.score} label={match.label} />
        <ConnectButton matchId={match._id} userId={person._id} status={match.status} />
      </div>
    </div>
  );
}
