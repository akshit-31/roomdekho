/**
 * Social auth entry points. The backend currently issues JWTs via
 * email/password only (see server/src/modules/auth) — these buttons are
 * wired to redirect into an OAuth flow once /auth/google and /auth/facebook
 * are added, and are disabled with a tooltip until then.
 */
export default function SocialLogin() {
  const providers = [
    { id: "google", label: "Continue with Google" },
    { id: "facebook", label: "Continue with Facebook" },
  ];

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-2 text-gray-400">or</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {providers.map((p) => (
          <button
            key={p.id}
            type="button"
            disabled
            title="Coming soon"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-500 opacity-60 cursor-not-allowed"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
