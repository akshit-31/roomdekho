import clsx from "clsx";

const LABEL_STYLES = {
  excellent: { ring: "#16a34a", text: "text-green-700", bg: "bg-green-50", label: "Excellent match" },
  high: { ring: "#2f7ef0", text: "text-brand-700", bg: "bg-brand-50", label: "Highly compatible" },
  moderate: { ring: "#d97706", text: "text-amber-700", bg: "bg-amber-50", label: "Moderate match" },
  low: { ring: "#9ca3af", text: "text-gray-600", bg: "bg-gray-100", label: "Low match" },
};

/**
 * Circular compatibility ring, e.g. "92% Match — Highly Compatible".
 * `score` 0-100, `label` one of low|moderate|high|excellent (from
 * server/src/modules/matching/match.engine.js).
 */
export default function CompatibilityScore({ score = 0, label = "moderate", size = 88 }) {
  const style = LABEL_STYLES[label] || LABEL_STYLES.moderate;
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef0f3" strokeWidth="8" />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={style.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{score}%</span>
        </div>
      </div>
      <div>
        <p className={clsx("text-sm font-semibold", style.text)}>{style.label}</p>
        <span className={clsx("inline-block rounded-full px-2 py-0.5 text-xs font-medium", style.bg, style.text)}>
          {score}% Match
        </span>
      </div>
    </div>
  );
}
