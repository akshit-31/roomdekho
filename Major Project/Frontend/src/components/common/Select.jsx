import clsx from "clsx";
import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder = "Select an option", className, id, ...rest },
  ref
) {
  const selectId = id || rest.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="mb-1 block text-sm font-semibold text-slate-200">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={clsx(
          "w-full rounded-xl border px-3 py-2 text-sm text-white bg-slate-900/90 backdrop-blur-md transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-400",
          error ? "border-rose-500" : "border-white/15 hover:border-white/25",
          className
        )}
        aria-invalid={!!error}
        {...rest}
      >
        <option value="" disabled hidden className="bg-slate-900 text-slate-400">{placeholder}</option>
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value} className="bg-slate-900 text-white">{text}</option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-rose-400">{error}</p>}
    </div>
  );
});

export default Select;
