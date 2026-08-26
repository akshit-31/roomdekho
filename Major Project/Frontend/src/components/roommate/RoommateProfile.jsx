import { ShieldCheck, MapPin } from "lucide-react";
import defaultAvatar from "/images/default-avatar.jpg";
import CompatibilityScore from "./CompatibilityScore";
import MatchExplanation from "./MatchExplanation";
import ConnectButton from "./ConnectButton";

const FIELD_LABELS = {
  food: "Food habit",
  sleepSchedule: "Sleep schedule",
  workSchedule: "Daily routine",
  cleanliness: "Cleanliness (1-5)",
  noiseTolerance: "Noise tolerance (1-5)",
  smoking: "Smokes",
  pets: "Has/wants pets",
};

function formatValue(key, value) {
  if (value === undefined || value === null) return "Not specified";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value).replace(/_/g, " ");
}

export default function RoommateProfile({ roommate, match }) {
  const prefs = roommate.preferences || {};

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={roommate.avatarUrl || defaultAvatar} alt={roommate.name} className="h-20 w-20 rounded-full object-cover" />
            <div>
              <h1 className="flex items-center gap-1.5 text-xl font-semibold text-gray-900">
                {roommate.name}
                {roommate.kyc?.status === "verified" && <ShieldCheck size={18} className="text-brand-500" />}
              </h1>
              {prefs.preferredLocations?.length > 0 && (
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <MapPin size={14} /> {prefs.preferredLocations.join(", ")}
                </p>
              )}
            </div>
          </div>
          <ConnectButton matchId={match?._id} userId={roommate._id} status={match?.status} />
        </div>

        {roommate.bio && <p className="mt-4 text-sm text-gray-600">{roommate.bio}</p>}
      </div>

      {match && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Compatibility with you</h2>
          <CompatibilityScore score={match.score} label={match.label} size={100} />
          <div className="mt-4">
            <MatchExplanation explanation={match.explanation} />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Lifestyle preferences</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {Object.keys(FIELD_LABELS).map((key) => (
            <div key={key} className="flex justify-between border-b border-gray-50 py-1.5 text-sm">
              <dt className="text-gray-500">{FIELD_LABELS[key]}</dt>
              <dd className="font-medium text-gray-900">{formatValue(key, prefs[key])}</dd>
            </div>
          ))}
        </dl>
        {prefs.personalityTags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {prefs.personalityTags.map((t) => (
              <span key={t} className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
