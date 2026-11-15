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
    <div className="space-y-5 text-white">
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={roommate.avatarUrl || defaultAvatar} alt={roommate.name} className="h-20 w-20 rounded-full object-cover border-2 border-amber-400/40" />
            <div>
              <h1 className="flex items-center gap-1.5 text-xl sm:text-2xl font-black text-white">
                {roommate.name}
                {roommate.kyc?.status === "verified" && <ShieldCheck size={20} className="text-emerald-400" />}
              </h1>
              {prefs.preferredLocations?.length > 0 && (
                <p className="mt-1 flex items-center gap-1 text-sm text-slate-300">
                  <MapPin size={14} className="text-amber-400" /> {prefs.preferredLocations.join(", ")}
                </p>
              )}
            </div>
          </div>
          <ConnectButton matchId={match?._id} userId={roommate._id} status={match?.status} />
        </div>

        {roommate.bio && <p className="mt-4 text-sm text-slate-300 leading-relaxed">{roommate.bio}</p>}
      </div>

      {match && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
          <h2 className="mb-4 text-base font-extrabold text-white">Compatibility with you</h2>
          <CompatibilityScore score={match.score} label={match.label} size={100} />
          <div className="mt-4">
            <MatchExplanation explanation={match.explanation} />
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl">
        <h2 className="mb-3 text-base font-extrabold text-white">Lifestyle preferences</h2>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          {Object.keys(FIELD_LABELS).map((key) => (
            <div key={key} className="flex justify-between border-b border-white/10 py-1.5 text-sm">
              <dt className="text-slate-400">{FIELD_LABELS[key]}</dt>
              <dd className="font-bold text-white">{formatValue(key, prefs[key])}</dd>
            </div>
          ))}
        </dl>
        {prefs.personalityTags?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {prefs.personalityTags.map((t) => (
              <span key={t} className="rounded-full bg-amber-500/20 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
