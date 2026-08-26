import clsx from "clsx";

const COLORS = {
  excellent: "bg-green-500",
  high: "bg-brand-500",
  moderate: "bg-amber-500",
  low: "bg-gray-400",
};

/**
 * Compact horizontal score bar — used in list/table contexts (MyMatches,
 * admin tables) where the full CompatibilityScore ring (see
 * components/roommate/CompatibilityScore.jsx) would take up too much space.
 */
export default function MatchScore({ score = 0, label = "moderate", showLabel = true }) {
  return (
    <div className="w-full max-w-[160px]">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-900">{score}%</span>
        {showLabel && <span className="capitalize text-gray-500">{label}</span>}
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={clsx("h-full rounded-full transition-all", COLORS[label] || COLORS.moderate)}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
