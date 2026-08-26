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
        <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        ref={ref}
        className={clsx(
          "w-full rounded-xl border px-3 py-2 text-sm text-gray-900 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500",
          error ? "border-red-400" : "border-gray-300",
          className
        )}
        aria-invalid={!!error}
        {...rest}
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((opt) => {
          const value = typeof opt === "string" ? opt : opt.value;
          const text = typeof opt === "string" ? opt : opt.label;
          return (
            <option key={value} value={value}>{text}</option>
          );
        })}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
