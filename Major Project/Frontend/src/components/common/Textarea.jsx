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
        <label htmlFor={areaId} className="mb-1 block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        ref={ref}
        rows={rows}
        className={clsx(
          "w-full rounded-xl border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 resize-y",
          error ? "border-red-400" : "border-gray-300",
          className
        )}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-gray-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default Textarea;
