import clsx from "clsx";
import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { label, error, hint, rows = 4, className, id, ...rest },
  ref
) {
  const areaId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={areaId} className="mb-1 block text-sm font-semibold text-slate-200">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={rows}
        className={clsx(
          "w-full rounded-xl border px-3 py-2 text-sm text-white placeholder:text-slate-400 bg-slate-900/80 backdrop-blur-md transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400 resize-y",
          error ? "border-rose-500" : "border-white/15 hover:border-white/25",
          className
        )}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? (
        <p className="mt-1 text-xs text-rose-400">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;
