import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/60 backdrop-blur-md px-4 py-3 text-sm text-rose-200 shadow-lg">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">
        <p>{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="mt-1 font-medium underline underline-offset-2">
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
