import clsx from "clsx";
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, className, id, ...rest },
  ref
) {
  const inputId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1 block text-sm font-semibold text-slate-200">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={clsx(
          "w-full rounded-xl border px-3 py-2 text-sm text-white placeholder:text-slate-400 bg-slate-900/80 backdrop-blur-md transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400",
          error ? "border-rose-500" : "border-white/15 hover:border-white/25",
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-rose-400">{error}</p>
      ) : hint ? (
        <p id={`${inputId}-hint`} className="mt-1 text-xs text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
