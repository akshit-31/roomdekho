import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip,
} from "recharts";

const MAX_WEIGHTS = {
  budget: 20, location: 15, food: 10, sleepSchedule: 10, workSchedule: 10,
  cleanliness: 10, noiseTolerance: 10, smoking: 5, pets: 5, personality: 5,
};

const SHORT_LABELS = {
  budget: "Budget", location: "Location", food: "Food", sleepSchedule: "Sleep",
  workSchedule: "Routine", cleanliness: "Cleanliness", noiseTolerance: "Noise",
  smoking: "Smoking", pets: "Pets", personality: "Personality",
};

/**
 * Radar/spider visualization of the match breakdown, normalized to a
 * 0-100 scale per attribute so every axis is comparable.
 */
export default function CompatibilityChart({ breakdown = {} }) {
  const data = Object.keys(MAX_WEIGHTS)
    .filter((k) => breakdown[k] !== undefined)
    .map((k) => ({
      attribute: SHORT_LABELS[k],
      value: Math.round((breakdown[k] / MAX_WEIGHTS[k]) * 100),
    }));

  if (!data.length) return null;

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="attribute" tick={{ fontSize: 11, fill: "#6b7280" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "#9ca3af" }} />
          <Radar
            name="Compatibility"
            dataKey="value"
            stroke="#2f7ef0"
            fill="#2f7ef0"
            fillOpacity={0.25}
          />
          <Tooltip formatter={(value) => `${value}%`} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
