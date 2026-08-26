import MatchPreferences from "../matching/MatchPreferences";

/**
 * Thin wrapper around matching/MatchPreferences so the same lifestyle
 * form powers both the AI matching engine input and the profile page —
 * one source of truth, two entry points.
 */
export default function ProfilePreferences({ initialValues, onSubmit }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">Roommate matching preferences</h2>
      <MatchPreferences initialValues={initialValues} onSubmit={onSubmit} />
    </div>
  );
}
