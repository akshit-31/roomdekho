// Max points per attribute, mirrored from
// server/src/modules/matching/match.engine.js WEIGHTS
const MAX_WEIGHTS = {
  budget: 20,
  location: 15,
  food: 10,
  sleepSchedule: 10,
  workSchedule: 10,
  cleanliness: 10,
  noiseTolerance: 10,
  smoking: 5,
  pets: 5,
  personality: 5,
};

const LABELS = {
  budget: "Budget",
  location: "Preferred location",
  food: "Food habits",
  sleepSchedule: "Sleep schedule",
  workSchedule: "Daily routine",
  cleanliness: "Cleanliness",
  noiseTolerance: "Noise tolerance",
  smoking: "Smoking",
  pets: "Pets",
  personality: "Personality/lifestyle",
};

export default function MatchBreakdown({ breakdown = {} }) {
  const keys = Object.keys(MAX_WEIGHTS).filter((k) => breakdown[k] !== undefined);
  if (!keys.length) return null;

  return (
    <div className="space-y-3">
      {keys.map((key) => {
        const max = MAX_WEIGHTS[key];
        const value = breakdown[key];
        const pct = Math.round((value / max) * 100);
        return (
          <div key={key}>
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>{LABELS[key]}</span>
              <span className="font-medium text-gray-900">{value}/{max}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-brand-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
