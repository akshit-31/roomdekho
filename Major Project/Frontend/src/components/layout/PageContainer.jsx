import clsx from "clsx";

/**
 * Generic max-width content wrapper for non-dashboard pages, with an
 * optional title/subtitle/action header row.
 */
export default function PageContainer({
  title,
  subtitle,
  action,
  className,
  children,
}) {
  return (
    <div className={clsx("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}>
      {(title || action) && (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title && <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">{title}</h1>}
            {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}
